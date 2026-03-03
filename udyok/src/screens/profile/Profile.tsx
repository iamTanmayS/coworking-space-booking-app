import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScreenWrapper, Icon } from '@/components'
import { colors, typography, radius, spacing } from '@/index'
import ProfileMenuItem from '@/components/specific/profile/ProfileMenuItem'
import { useNavigation } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { logout } from '@/features/authentication/Auth.slice'
import { RootState } from '@/store/store'

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const userName = profile?.name || 'Tanmay Shukla';
  const userAvatar = profile?.avatar || 'https://i.pravatar.cc/300?img=11';

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="ionicons" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile' as never)}>
              <Icon name="pencil" library="ionicons" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <ProfileMenuItem
            icon="person-outline"
            label="Your profile"
            onPress={() => navigation.navigate('EditProfile' as never)}
          />
          <ProfileMenuItem
            icon="card-outline"
            label="Payment Methods"
            onPress={() => navigation.navigate('AddCard' as never)}
          />
          <ProfileMenuItem
            icon="clipboard-outline"
            label="My Bookings"
            onPress={() => navigation.navigate('BookingManagement' as never)}
          />
          <ProfileMenuItem
            icon="wallet-outline"
            label="My Wallet"
            onPress={() => navigation.navigate('Wallet' as never)}
          />
          <ProfileMenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate('Settings' as never)}
          />
          <ProfileMenuItem
            icon="key-outline"
            label="Change Password"
            onPress={() => navigation.navigate('PasswordManager' as never)}
          />
          <ProfileMenuItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => navigation.navigate('HelpCenter' as never)}
          />
          <ProfileMenuItem
            icon="lock-closed-outline"
            label="Privacy Policy"
            onPress={() => console.log('Privacy Policy')}
          />
          <ProfileMenuItem
            icon="person-add-outline"
            label="Invites Friends"
            onPress={() => console.log('Invites Friends')}
          />
          <ProfileMenuItem
            icon="log-out-outline"
            label="Log out"
            onPress={handleLogout}
            textColor={colors.error}
            iconColor={colors.error}
            showChevron={false}
          />
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
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
  scrollContent: {
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary, // Green color
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  menuContainer: {
    paddingHorizontal: 24,
  },
});