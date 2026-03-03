import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Icon } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

interface WriteReviewModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; title: string; description: string }) => Promise<void>;
    isLoading: boolean;
}

export default function WriteReviewModal({
    visible,
    onClose,
    onSubmit,
    isLoading
}: WriteReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Required', 'Please select a star rating.');
            return;
        }
        if (!title.trim() || !description.trim()) {
            Alert.alert('Required', 'Please provide a title and description for your review.');
            return;
        }

        try {
            await onSubmit({ rating, title, description });
            // Reset form on success
            setRating(0);
            setTitle('');
            setDescription('');
        } catch (e) {
            // Error handled by parent
        }
    };

    const handleClose = () => {
        setRating(0);
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />

                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Write a Review</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Icon name="close" library="material" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scrollContent}>
                        <Text style={styles.label}>Rate your experience</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starButton}
                                >
                                    <Icon
                                        name={star <= rating ? "star" : "star-border"}
                                        library="material"
                                        size={40}
                                        color={star <= rating ? colors.warning : colors.border}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Review Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Great workspace, very quiet"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor={colors.textSecondary}
                            maxLength={100}
                        />

                        <Text style={styles.label}>Review Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Share details of your experience at this space..."
                            value={description}
                            onChangeText={setDescription}
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                    </View>

                    <View style={styles.footer}>
                        <PrimaryButton
                            title={isLoading ? "Submitting..." : "Submit Review"}
                            onPress={handleSubmit}
                            disabled={isLoading || rating === 0 || !title.trim() || !description.trim()}
                            fullWidth
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingTop: spacing.lg,
        maxHeight: '85%',

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    headerTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    closeButton: {
        padding: spacing.xs,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.xl,
    },
    starButton: {
        padding: spacing.xs,
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
        fontSize: typography.fontSize.md,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },
    textArea: {
        minHeight: 120,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        backgroundColor: colors.background,
    },
});
