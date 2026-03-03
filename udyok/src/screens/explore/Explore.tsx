import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { ScreenWrapper, Icon } from '@/components';
import SpaceCard from "@/components/reusable_components/cards/SpaceCard"
import { colors, spacing, typography, radius } from '@/index';
import { useExploreViewModel } from '@/viewmodels/explore/useExploreViewModel';
import { FilterModal } from '@/components/specific/FilterModal';
import { FilterParams } from '@/features/spaces/spaces.types';

export default function Explore() {
  const {
    spaces,
    searchQuery,
    filterParams,
    isLoading,
    error,
    handleSearch,
    applyFilters,
  } = useExploreViewModel();

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const onApplyFilter = (filters: FilterParams) => {
    applyFilters(filters);
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Spaces</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon library="ionicons" name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search spaces..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
              selectionColor={colors.primary}
            />
          </View>

          <Pressable
            onPress={() => setIsFilterVisible(true)}
            style={styles.filterButton}
            android_ripple={{ color: colors.ripple }}
          >
            <Icon library="ionicons" name="options" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading spaces...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Icon library="ionicons" name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>Failed to load spaces</Text>
            <Text style={styles.errorSubtext}>Please try again later</Text>
          </View>
        ) : spaces.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icon library="ionicons" name="search" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No spaces found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          <FlatList
            data={spaces}
            renderItem={({ item }) => <SpaceCard space={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <FilterModal
          visible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          onApply={onApplyFilter}
          initialFilters={filterParams}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchContainer: {
    flex: 1,
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
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
  errorText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  errorSubtext: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
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
  },
});
