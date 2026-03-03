import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper, PrimaryButton, Icon } from '@/components';
import { colors, spacing, typography, radius } from '@/index';
import { useLocationViewModel } from '@/viewmodels/location/LocationViewModel';
import type { PhotonFeature } from '@/features/location/location.types';
import type { RootStackParamList } from '@/navigation/RootStackNavigator';

export default function Location() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    currentLocation,
    currentCity,
    searchResults,
    isLoadingLocation,
    isSearching,
    isSaving,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    searchLocations,
    selectLocation,
    saveLocation,
  } = useLocationViewModel();

  const [searchQuery, setSearchQuery] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleGetCurrentLocation = async () => {
    try {
      // Check if permission is already granted
      if (permissionStatus === null || permissionStatus !== 'granted') {
        setShowPermissionModal(true);
        return;
      }
      await getCurrentLocation();
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setShowPermissionModal(false);
    if (granted) {
      await getCurrentLocation();
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchLocations(text);
  };

  const handleSelectLocation = (feature: PhotonFeature) => {
    selectLocation(feature);
    setSearchQuery('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchLocations('');
  };

  const handleSave = async () => {
    try {
      await saveLocation();
      // Explicit navigation as safety net alongside Redux-driven auto-navigation
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const renderSearchResult = ({ item }: { item: PhotonFeature }) => {
    const city = item.properties.city || item.properties.name || 'Unknown';
    const address = item.properties.street || item.properties.state || item.properties.country || '';

    return (
      <Pressable
        style={styles.searchResultItem}
        onPress={() => handleSelectLocation(item)}
      >
        <View style={styles.locationIconContainer}>
          <Icon library="ionicons" name="location" size="md" color={colors.primary} />
        </View>
        <View style={styles.searchResultText}>
          <Text style={styles.searchResultCity}>{city}</Text>
          {address && <Text style={styles.searchResultAddress}>{address}</Text>}
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon library="ionicons" name="arrow-back" size="md" color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Enter Your Location</Text>
          <View style={styles.backButton} />
        </View>

        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Icon library="ionicons" name="search" size="md" color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClearSearch} style={styles.clearButton}>
              <Icon library="ionicons" name="close-circle" size="md" color={colors.primary} />
            </Pressable>
          )}
          {isSearching && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        {/* Use Current Location Button */}
        <Pressable
          style={styles.currentLocationButton}
          onPress={handleGetCurrentLocation}
          disabled={isLoadingLocation}
        >
          <View style={styles.locationIconContainer}>
            <Icon
              library="ionicons"
              name="location"
              size="md"
              color={colors.primary}
            />
          </View>
          <Text style={styles.currentLocationText}>
            {isLoadingLocation ? 'Getting location...' : 'Use my current location'}
          </Text>
          {isLoadingLocation && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator} />
          )}
        </Pressable>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsLabel}>SEARCH RESULT</Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item, index) => `${item.properties.name}-${index}`}
              style={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Current Location Display */}
        {currentCity && searchResults.length === 0 && (
          <View style={styles.selectedLocationContainer}>
            <Text style={styles.searchResultsLabel}>SELECTED LOCATION</Text>
            <View style={styles.searchResultItem}>
              <View style={styles.locationIconContainer}>
                <Icon library="ionicons" name="location" size="md" color={colors.primary} />
              </View>
              <View style={styles.searchResultText}>
                <Text style={styles.searchResultCity}>{currentCity}</Text>
                <Text style={styles.searchResultAddress}>Current Location</Text>
              </View>
            </View>
          </View>
        )}

        {/* Continue Button */}
        {currentCity && (
          <View style={styles.continueButtonContainer}>
            <PrimaryButton
              title="Continue"
              onPress={handleSave}
              loading={isSaving}
              disabled={isSaving}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </View>

      {/* Permission Modal */}
      <Modal
        visible={showPermissionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon library="ionicons" name="location" size="xl" color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Location Permission Required</Text>
            <Text style={styles.modalMessage}>
              We need access to your location to show you nearby spaces and provide better recommendations.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleRequestPermission}
              >
                <Text style={styles.modalButtonTextPrimary}>Allow</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper >
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  loadingIndicator: {
    marginLeft: spacing.sm,
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  selectedLocationContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  searchResultsLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchResultText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  searchResultCity: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.textPrimary,
  },
  searchResultAddress: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  continueButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalMessage: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonTextPrimary: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.textInverse,
  },
  modalButtonTextSecondary: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
});

