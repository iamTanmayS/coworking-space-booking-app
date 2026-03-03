import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { ScreenWrapper, Icon } from '@/components';
import { colors, radius, spacing, typography } from '@/index';
import { FormInput } from '@/components/reusable_components/Inputs/FormInput';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { useUserViewModel } from '@/viewmodels/user/useUserViewModel';
import * as ImagePicker from 'expo-image-picker';

type EditProfileFormData = {
    name: string;
    phone: string;
    email: string;
};

const EditProfile = () => {
    const navigation = useNavigation();
    const { user, updateProfile, uploadAvatar, isLoading } = useUserViewModel();

    const { control, handleSubmit, setValue } = useForm<EditProfileFormData>({
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            email: user?.email || '',
        }
    });

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('phone', user.phone || '');
            setValue('email', user.email);
        }
    }, [user, setValue]);

    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            // For mock purposes, just showing successful upload with random pravatar
            // In real app, we would upload the file
            const formData = new FormData();
            formData.append('avatar', {
                uri: uri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            } as any);

            await uploadAvatar(formData);
        }
    };

    const onSubmit = async (data: EditProfileFormData) => {
        const success = await updateProfile(data);
        if (success) {
            navigation.goBack();
        }
    };

    const userAvatar = user?.avatar || 'https://i.pravatar.cc/300?img=11';

    return (
        <ScreenWrapper backgroundColor={colors.background}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" library="ionicons" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: userAvatar }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
                            <Icon name="pencil" library="ionicons" size={14} color={colors.background} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>

                    <FormInput
                        control={control}
                        name="name"
                        label="Name"
                        placeholder="Enter your name"
                    />

                    <FormInput
                        control={control}
                        name="phone"
                        label="Phone Number"
                        placeholder="Enter phone number"
                    />

                    <FormInput
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Enter email"
                    // Email usually read-only but rendered as input
                    />

                </View>
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={isLoading ? "Updating..." : "Update Profile"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    fullWidth
                />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        padding: 8,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary, // using primary color (green)
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    form: {
        gap: spacing.md,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
});

export default EditProfile;
