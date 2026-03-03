import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { ScreenWrapper } from '@/components';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import CreditCardVisual from '@/components/specific_components/booking/CreditCardVisual';

type AddCardRoute = RouteProp<{
  AddCard: {
    spaceId?: string;
    spaceName?: string;
    totalAmount?: number;
    duration?: number;
    date?: string;
    startTime?: string;
    endTime?: string;
    spaceImage?: string;
    spaceLocation?: string;
    spaceRating?: number;
  };
}>;

export default function AddCard() {
  const navigation = useNavigation();
  const route = useRoute<AddCardRoute>();
  const {
    spaceId, spaceName, totalAmount, duration, date, startTime, endTime,
    spaceImage, spaceLocation, spaceRating
  } = route.params || {};

  const { createPaymentMethod } = useStripe();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveCard = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Incomplete Card', 'Please enter complete card details');
      return;
    }

    setLoading(true);
    try {
      // Create a PaymentMethod from the card details
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
      });

      setLoading(false);

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (paymentMethod) {
        Alert.alert('Success', 'Card added successfully');

        // If we have booking details, continue the flow
        if (spaceId) {
          // Navigate to ReviewSummary with the payment method info
          // @ts-ignore
          navigation.navigate('ReviewSummary', {
            spaceId,
            spaceName,
            totalAmount,
            duration,
            date,
            startTime,
            endTime,
            paymentMethodId: paymentMethod.id,
            paymentLabel: `Card ending ${paymentMethod.Card?.last4 ?? '****'}`,
            paymentIcon: 'credit-card',
            spaceImage,
            spaceLocation,
            spaceRating
          });
        } else {
          // Standalone mode (e.g. from Profile), just go back
          navigation.goBack();
        }
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Failed to save card');
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            library="material"
            size={24}
            color={colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Add Card</Text>
        </View>

        <CreditCardVisual />

        <View style={styles.cardContainer}>
          <Text style={styles.label}>Enter Card Details</Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.card}
            style={styles.cardField}
            onCardChange={(details) => {
              setCardDetails(details);
            }}
          />
          <Text style={styles.hint}>
            Test card: 4242 4242 4242 4242 | Any future date | Any CVC
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={loading ? 'Saving...' : 'Save & Continue'}
            onPress={handleSaveCard}
            disabled={!cardDetails?.complete || loading}
            fullWidth
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.sm,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  cardField: {
    height: 50,
    marginVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
