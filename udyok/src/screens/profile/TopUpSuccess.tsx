import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

export default function TopUpSuccess() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.successIconContainer}>
          <Icon name="check-circle" library="material" size={100} color="#4CAF50" />
        </View>
        <Text style={styles.title}>Top Up Successful!</Text>
        <Text style={styles.subtitle}>
          Your wallet has been credited successfully.
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Back to Wallet"
            onPress={() => {
              // Pop back to Wallet screen
              navigation.goBack();
              navigation.goBack();
            }}
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.xl,
  }
});
