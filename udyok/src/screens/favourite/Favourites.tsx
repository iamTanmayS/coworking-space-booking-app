import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { ScreenWrapper, Icon } from '@/components';
import SpaceCard from '@/components/reusable_components/cards/SpaceCard';
import { colors, spacing, typography, radius } from '@/index';
import { useFavoritesViewModel } from '@/viewmodels/favourites/Favourites';

export default function Favourites() {
  const {
    favorites,
    searchInput,
    isLoading,
    setSearchInput,
    handleSearchSubmit,
  } = useFavoritesViewModel();

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Favourites</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>

            <TextInput
              style={styles.searchInput}
              placeholder="Search favourites..."
              placeholderTextColor={colors.textSecondary}
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              selectionColor={colors.primary}
            />

            <Pressable
              onPress={handleSearchSubmit}
              style={({ pressed }) => [
                styles.searchButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Icon library="ionicons" name="search" size={20} color={colors.textInverse} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading favourites...</Text>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icon library="ionicons" name="heart-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {searchInput ? 'No favourites found' : 'No favourites yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchInput ? 'Try a different search term' : 'Start adding spaces to your favourites'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={({ item }) => <SpaceCard space={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchContainer: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  emptySubtext: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});