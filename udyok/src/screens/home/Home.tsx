import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { HomeHeader, SpecialOfferCard, ScreenWrapper, Icon, PopularSpaceCard } from '@/components';
import { spacing, typography, colors } from '@/index';
import { Category } from '@/services/mockData';
import { useHomeViewModel } from '@/viewmodels/home/useHomeViewModel';

export default function Home() {
  const {
    location,
    categories,
    offers,
    spaces,
    isLoading,
    error,
    handleSearch,
    handleNotification,
    handleLocationPress,
    handleClaim,
    handleCategoryPress
  } = useHomeViewModel();

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Pressable style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <View style={styles.categoryIconContainer}>
        <Icon library={item.library} name={item.icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </Pressable>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Special Offers Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>#SpecialForYou</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </View>

        <FlatList
          data={offers}
          renderItem={({ item }) => (
            <SpecialOfferCard
              {...item}
              onClaim={() => handleClaim(item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersList}
        />
      </View>

      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Popular Spaces Header */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Spaces</Text>
          <Text style={styles.seeAllText}>See All</Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load spaces</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <ScreenWrapper
      scrollable={false}
      safeAreaEdges={['left', 'right', 'bottom']}
      statusBarColor={colors.primary}
      statusBarStyle="light-content"
    >
      <View style={styles.container}>
        <HomeHeader
          location={location}
          onSearch={handleSearch}
          onNotificationPress={handleNotification}
          onLocationPress={handleLocationPress}
        />

        <FlatList
          data={spaces}
          renderItem={({ item }) => (
            <View style={styles.popularItemContainer}>
              <PopularSpaceCard space={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    marginBottom: spacing.xs,
  },
  popularItemContainer: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  offersList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(26, 182, 92, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: colors.error,
  },
});