import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Vibration,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSocket } from '@/features/chat/SocketContext';
import { useAppSelector } from '@/store/store';
import { Icon } from '@/components';
import { colors } from '@/index';
import type { ChatStackParamList } from '@/navigation/featurestacks/ChatStack';

type VoiceCallRouteProp = RouteProp<ChatStackParamList, 'VoiceCall'>;

type CallState = 'calling' | 'ringing' | 'active' | 'ended';

export default function VoiceCall() {
  const navigation = useNavigation();
  const route = useRoute<VoiceCallRouteProp>();
  const { chatId, participantName, participantId, isIncoming, callerId, sdpOffer } = route.params as any;

  const { socket } = useSocket();
  const currentUserId = useAppSelector((state: any) => state.auth?.user?.userId || state.user?.profile?.id);

  const [callState, setCallState] = useState<CallState>(isIncoming ? 'ringing' : 'calling');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vibrate when ringing
  useEffect(() => {
    if (callState === 'ringing') {
      Vibration.vibrate([1000, 1000], true);
    } else {
      Vibration.cancel();
    }
    return () => Vibration.cancel();
  }, [callState]);

  // Listen for WebRTC signaling events
  useEffect(() => {
    if (!socket) return;

    const handleCallAnswered = ({ sdpAnswer }: any) => {
      setCallState('active');
      startTimer();
    };

    const handleIceCandidate = ({ candidate }: any) => {
      // In real implementation, add to RTCPeerConnection
      console.log('[VoiceCall] ICE candidate received:', candidate);
    };

    const handleCallEnded = () => {
      endCall(false);
    };

    socket.on('call_answered', handleCallAnswered);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('call_ended', handleCallEnded);

    // If outgoing call, emit call_user event
    if (!isIncoming) {
      socket.emit('call_user', {
        targetUserId: participantId,
        chatId,
        callType: 'voice',
        sdpOffer: 'PLACEHOLDER_SDP_OFFER', // Real SDP would come from RTCPeerConnection
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
      {/* Avatar / Icon */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Icon name="person" library="ionicons" size={72} color="#fff" />
        </View>
        <Text style={styles.participantName}>{participantName || 'Unknown'}</Text>
        <Text style={styles.callStatus}>
          {callState === 'calling' && 'Calling…'}
          {callState === 'ringing' && 'Incoming Voice Call'}
          {callState === 'active' && formatDuration(duration)}
          {callState === 'ended' && 'Call Ended'}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.controls}>
        {callState === 'active' && (
          <>
            <TouchableOpacity
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Icon name={isMuted ? 'mic-off' : 'mic'} library="ionicons" size={28} color={isMuted ? '#fff' : colors.textPrimary} />
              <Text style={[styles.controlLabel, isMuted && { color: '#fff' }]}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Icon name="volume-high" library="ionicons" size={28} color={isSpeaker ? '#fff' : colors.textPrimary} />
              <Text style={[styles.controlLabel, isSpeaker && { color: '#fff' }]}>Speaker</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* End / Accept / Decline */}
      <View style={styles.actionRow}>
        {callState === 'ringing' ? (
          <>
            <TouchableOpacity style={styles.declineBtn} onPress={() => endCall(true)}>
              <Icon name="call" library="ionicons" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={acceptCall}>
              <Icon name="call" library="ionicons" size={32} color="#fff" />
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
    backgroundColor: '#1a1a2e',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  participantName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  callStatus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 40,
  },
  controlBtn: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minWidth: 80,
  },
  controlBtnActive: {
    backgroundColor: colors.primary,
  },
  controlLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
    shadowColor: '#e53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
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
