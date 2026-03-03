import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius, typography, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import { useSettingsViewModel } from '@/viewmodels/profile/useSettingsViewModel';

export default function Settings() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { settings, isLoading, updateSetting } = useSettingsViewModel();

  if (isLoading && !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderToggleItem = (
    icon: string,
    initials: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: (val: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Icon name={icon} library={initials as any} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: colors.primary + '80' }}
        thumbColor={value ? colors.primary : '#F5F5F5'}
      />
    </View>
  );

  const renderActionItem = (
    icon: string,
    initials: string,
    title: string,
    value: string,
    onPress: () => void
  ) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIconContainer}>
        <Icon name={icon} library={initials as any} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.actionRight}>
        <Text style={styles.actionValue}>{value}</Text>
        <Icon name="chevron-forward" library="ionicons" size={20} color={colors.textSecondary} />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="ionicons" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>

          {renderActionItem(
            'globe-outline',
            'ionicons',
            'Language',
            settings.language === 'en' ? 'English' : settings.language,
            () => console.log('Language picked') // Will open a modal/sheet in real impl
          )}

          {renderActionItem(
            'time-outline',
            'ionicons',
            'Timezone',
            settings.timezone,
            () => console.log('Timezone picked')
          )}

          {renderActionItem(
            'color-palette-outline',
            'ionicons',
            'Theme',
            settings.theme === 'light' ? 'Light Mode' : 'Dark Mode',
            () => updateSetting('theme', settings.theme === 'light' ? 'dark' : 'light')
          )}
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionHeader}>Notifications</Text>

          {renderToggleItem(
            'notifications-outline',
            'ionicons',
            'Push Notifications',
            'Receive alerts on this device',
            settings.notifications,
            (val) => updateSetting('notifications', val)
          )}

          {renderToggleItem(
            'mail-outline',
            'ionicons',
            'Email Updates',
            'Receive promotional and activity emails',
            settings.emailNotifications,
            (val) => updateSetting('emailNotifications', val)
          )}

          {renderToggleItem(
            'chatbubble-outline',
            'ionicons',
            'SMS Alerts',
            'Receive text messages for important updates',
            settings.smsNotifications,
            (val) => updateSetting('smsNotifications', val)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  lastSection: {
    marginBottom: spacing.xxxl * 2,
  },
  sectionHeader: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  }
});
