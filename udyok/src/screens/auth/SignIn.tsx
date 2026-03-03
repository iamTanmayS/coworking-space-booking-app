import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import SigninForm from '@/components/screen_components/signin/SigninForm';
import SignupWithThirdPary from '@/components/screen_components/signup/SignupWithThirdPary';
import { colors, spacing, typography } from '@/index';
import { ScreenWrapper } from '@/components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Hi! Welcome back, you've been missed
          </Text>
        </View>

        <SigninForm />
        <SignupWithThirdPary dividerText="Or sign in with" />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account? <Pressable onPress={() => navigation.navigate("CreateAccount")}><Text style={styles.signUpLink}>Sign Up</Text></Pressable>
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
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  signUpLink: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
});
