import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Icon } from '@/components'
import { colors, typography, shadow, radius } from '@/index'

export interface AboutProps {
    walkingTime?: string;
    distance?: string;
    status?: 'Open' | 'Closed';
    description: string;
    operatorName: string;
    operatorAvatar: string;
    onMessageOperator?: () => void;
    onCallOperator?: () => void;
}

const About = ({
    walkingTime = '05 Mins',
    distance = '2.3 Km',
    status = 'Open',
    description,
    operatorName,
    operatorAvatar,
    onMessageOperator,
    onCallOperator,
}: AboutProps) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Icon name="walk" library="ionicons" size={20} color={colors.primary} />
                    <Text style={styles.statText}>{walkingTime}</Text>
                </View>
                <View style={styles.statItem}>
                    <Icon name="location" library="ionicons" size={20} color={colors.primary} />
                    <Text style={styles.statText}>{distance}</Text>
                </View>
                <View style={styles.statItem}>
                    <Icon name="time" library="ionicons" size={20} color={status === 'Open' ? colors.success : colors.error} />
                    <Text style={[styles.statText, { color: status === 'Open' ? colors.success : colors.error }]}>{status}</Text>
                </View>
            </View>

            {/* Description Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text
                    style={styles.descriptionText}
                    numberOfLines={isDescriptionExpanded ? undefined : 3}
                >
                    {description}
                </Text>
                <Pressable onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                    <Text style={styles.readMore}>
                        {isDescriptionExpanded ? 'Read less' : 'Read more'}
                    </Text>
                </Pressable>
            </View>

            {/* Operated by Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Operated by</Text>
                <View style={styles.operatorCard}>
                    <Image
                        source={{ uri: operatorAvatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.operatorInfo}>
                        <Text style={styles.operatorName}>{operatorName}</Text>
                        <Text style={styles.operatorRole}>Space Owner</Text>
                    </View>
                    <View style={styles.operatorActions}>
                        <Pressable
                            style={styles.actionButton}
                            onPress={onMessageOperator}
                        >
                            <Icon name="chatbubble-ellipses" library="ionicons" size={20} color={colors.primary} />
                        </Pressable>
                        <Pressable
                            style={styles.actionButton}
                            onPress={onCallOperator}
                        >
                            <Icon name="call" library="ionicons" size={20} color={colors.primary} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 100, // Extra padding to account for bottom price bar
        backgroundColor: colors.background,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statText: {
        fontSize: typography.fontSize.lg,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: typography.fontSize.md,
        lineHeight: 22,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    readMore: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
    },
    operatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: radius.lg,
        ...shadow.sm,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: colors.border,
    },
    operatorInfo: {
        flex: 1,
    },
    operatorName: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    operatorRole: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    operatorActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadow.sm,
    },
})