import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, typography } from '@/index';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
    totalSeconds: number;
    remainingSeconds: number;
    radius?: number;
    strokeWidth?: number;
}

export default function CircularTimer({
    totalSeconds,
    remainingSeconds,
    radius = 120,
    strokeWidth = 15
}: CircularTimerProps) {
    const { width } = Dimensions.get('window');
    const size = radius * 2 + strokeWidth;
    const circumference = 2 * Math.PI * radius;

    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const percentage = remainingSeconds / totalSeconds;
        Animated.timing(progress, {
            toValue: percentage,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [remainingSeconds, totalSeconds]);

    const strokeDashoffset = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0]
    });

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#F0F0F0"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colors.primary} // Green
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                    {/* Knob (Optional, simpler without for now) */}
                </G>
            </Svg>
            <View style={styles.textContainer}>
                <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
                <Text style={styles.subText}>Remaining Time</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerText: {
        fontFamily: typography.fontFamily.bold,
        fontSize: 32,
        color: colors.textPrimary,
    },
    subText: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginTop: 4,
    },
});
