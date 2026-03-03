import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSocket } from '@/features/chat/SocketContext';
import { useAppSelector } from '@/store/store';
import { Icon } from '@/components';
import { colors } from '@/index';
import type { ChatStackParamList } from '@/navigation/featurestacks/ChatStack';

type VideoCallRouteProp = RouteProp<ChatStackParamList, 'VideoCall'>;

type CallState = 'calling' | 'ringing' | 'active' | 'ended';

export default function VideoCall() {
  const navigation = useNavigation();
  const route = useRoute<VideoCallRouteProp>();
  const { chatId, participantName, participantId, isIncoming, callerId, sdpOffer } = route.params as any;

  const { socket } = useSocket();
  const currentUserId = useAppSelector((state: any) => state.auth?.user?.userId || state.user?.profile?.id);

  const [callState, setCallState] = useState<CallState>(isIncoming ? 'ringing' : 'calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vibrate when ringing
  useEffect(() => {
    if (callState === 'ringing') Vibration.vibrate([1000, 1000], true);
    else Vibration.cancel();
    return () => Vibration.cancel();
  }, [callState]);

  useEffect(() => {
    if (!socket) return;

    const handleCallAnswered = ({ sdpAnswer }: any) => {
      setCallState('active');
      startTimer();
    };

    const handleIceCandidate = ({ candidate }: any) => {
      console.log('[VideoCall] ICE candidate received:', candidate);
    };

    const handleCallEnded = () => {
      endCall(false);
    };

    socket.on('call_answered', handleCallAnswered);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('call_ended', handleCallEnded);

    if (!isIncoming) {
      socket.emit('call_user', {
        targetUserId: participantId,
        chatId,
        callType: 'video',
        sdpOffer: 'PLACEHOLDER_SDP_OFFER',
      });
    }

    return () => {
      socket.off('call_answered', handleCallAnswered);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('call_ended', handleCallEnded);
    };
  }, [socket]);

  const startTimer = () => {
    durationTimer.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const endCall = useCallback((emitToSocket = true) => {
    if (durationTimer.current) clearInterval(durationTimer.current);
    setCallState('ended');
    Vibration.cancel();
    if (emitToSocket && socket) {
      socket.emit('end_call', { targetUserId: participantId, chatId });
    }
    setTimeout(() => navigation.goBack(), 800);
  }, [socket, participantId, chatId, navigation]);

  const acceptCall = useCallback(() => {
    if (!socket) return;
    setCallState('active');
    startTimer();
    socket.emit('answer_call', {
      callerId: callerId || participantId,
      chatId,
      sdpAnswer: 'PLACEHOLDER_SDP_ANSWER',
    });
  }, [socket, callerId, participantId, chatId]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Remote video (placeholder / dark background) */}
      <View style={styles.remoteVideo}>
        <View style={styles.remoteVideoPlaceholder}>
          <Icon name="person" library="ionicons" size={80} color="rgba(255,255,255,0.3)" />
        </View>

        {/* Status overlay */}
        <View style={styles.statusOverlay}>
          <Text style={styles.participantName}>{participantName || 'Unknown'}</Text>
          <Text style={styles.callStatus}>
            {callState === 'calling' && '📹  Calling…'}
            {callState === 'ringing' && '📹  Incoming Video Call'}
            {callState === 'active' && formatDuration(duration)}
            {callState === 'ended' && 'Call Ended'}
          </Text>
        </View>
      </View>

      {/* Local camera preview placeholder */}
      {callState === 'active' && !isCameraOff && (
        <View style={styles.localVideo}>
          <View style={styles.localVideoInner}>
            <Icon name="person" library="ionicons" size={30} color="rgba(255,255,255,0.5)" />
          </View>
        </View>
      )}

      {/* Call controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Icon name={isMuted ? 'mic-off' : 'mic'} library="ionicons" size={26} color="#fff" />
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <Icon name={isCameraOff ? 'videocam-off' : 'videocam'} library="ionicons" size={26} color="#fff" />
          <Text style={styles.controlLabel}>{isCameraOff ? 'Camera On' : 'Camera Off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsFrontCamera(!isFrontCamera)}
        >
          <Icon name="camera-reverse" library="ionicons" size={26} color="#fff" />
          <Text style={styles.controlLabel}>Flip</Text>
        </TouchableOpacity>
      </View>

      {/* End / Accept buttons */}
      <View style={styles.actionRow}>
        {callState === 'ringing' ? (
          <>
            <TouchableOpacity style={styles.declineBtn} onPress={() => endCall(true)}>
              <Icon name="call" library="ionicons" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={acceptCall}>
              <Icon name="videocam" library="ionicons" size={32} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.endBtn, callState === 'ended' && { opacity: 0.5 }]}
            onPress={() => endCall(true)}
            disabled={callState === 'ended'}
          >
            <Icon name="call" library="ionicons" size={32} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  remoteVideo: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  participantName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  callStatus: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 90,
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
  },
  localVideoInner: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlBtn: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 72,
  },
  controlBtnActive: {
    backgroundColor: colors.primary,
  },
  controlLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
  declineBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
  acceptBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#43a047',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
