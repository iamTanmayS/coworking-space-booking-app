import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import { Icon } from '@/components'
import { colors, typography, radius, spacing } from '@/index'

import { IconLibrary } from '@/components/reusable_components/icons/Icon';

export interface ProfileMenuItemProps {
    icon: string;
    iconLibrary?: IconLibrary;
    label: string;
    onPress: () => void;
    showChevron?: boolean;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    textColor?: string;
    iconColor?: string;
}

const ProfileMenuItem = ({
    icon,
    iconLibrary = "ionicons",
    label,
    onPress,
    showChevron = true,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    textColor = colors.textPrimary,
    iconColor = colors.primary,
}: ProfileMenuItemProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={showSwitch} // If switch is shown, handle press via switch or separate logic
        >
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Icon
                        name={icon}
                        library={iconLibrary}
                        size={24}
                        color={iconColor}
                    />
                </View>
                <Text style={[styles.label, { color: textColor }]}>{label}</Text>
            </View>

            <View style={styles.rightContent}>
                {showSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={'#ffffff'}
                    />
                ) : showChevron ? (
                    <Icon
                        name="chevron-forward"
                        library="ionicons"
                        size={20}
                        color={colors.primary}
                    />
                ) : null}
            </View>
        </TouchableOpacity>
    )
}

export default ProfileMenuItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border, // Assuming a light border color exists
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    label: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.md,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
