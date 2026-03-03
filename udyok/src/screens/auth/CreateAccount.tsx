import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import SignupForm from '@/components/screen_components/signup/SignupForm';
import SignupWithThirdPary from '@/components/screen_components/signup/SignupWithThirdPary';
import { colors, spacing, typography } from '@/index';
import { ScreenWrapper } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';



export default function CreateAccount() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, "CreateAccount">>()
  return (
    <ScreenWrapper
      keyboardAvoiding>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Fill your information below or register{'\n'}with your social account.
          </Text>
        </View>

        <SignupForm />
        <SignupWithThirdPary />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already  have an account? <Pressable onPress={() => navigation.navigate('SignIn')}><Text style={styles.signInLink}>Sign In</Text></Pressable>
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  signInLink: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
});
