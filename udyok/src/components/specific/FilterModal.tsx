import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { RangeSlider } from '../reusable_components/RangeSlider';
import { Category, MOCK_CATEGORIES } from '@/services/mockData';

const { height } = Dimensions.get('window');

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    category?: string;
    amenities?: string[];
}

const FACILITIES = [
    'WiFi', 'AC', 'Kitchen', 'Meeting Room', 'Printer', 'Parking', 'Coffee'
];

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
    initialFilters,
}) => {
    const [priceRange, setPriceRange] = useState<[number, number]>([
        initialFilters?.minPrice || 100,
        initialFilters?.maxPrice || 1000
    ]);
    const [selectedRating, setSelectedRating] = useState<number | undefined>(initialFilters?.minRating);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialFilters?.category);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters?.amenities || []);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setPriceRange([
                initialFilters?.minPrice || 100,
                initialFilters?.maxPrice || 1000
            ]);
            setSelectedRating(initialFilters?.minRating);
            setSelectedCategory(initialFilters?.category);
            setSelectedAmenities(initialFilters?.amenities || []);
        }
    }, [visible, initialFilters]);

    const handleApply = () => {
        onApply({
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            minRating: selectedRating,
            category: selectedCategory,
            amenities: selectedAmenities,
        });
        onClose();
    };

    const handleReset = () => {
        setPriceRange([100, 1000]);
        setSelectedRating(undefined);
        setSelectedCategory(undefined);
        setSelectedAmenities([]);
    };

    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(prev => prev.filter(a => a !== amenity));
        } else {
            setSelectedAmenities(prev => [...prev, amenity]);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={16}
                        color={colors.warning}
                        style={{ marginRight: 2 }}
                    />
                ))}
            </View>
        );
    };

    const RatingOption = ({ rating, label }: { rating: number, label: string }) => (
        <TouchableOpacity
            style={styles.ratingRow}
            onPress={() => setSelectedRating(rating === selectedRating ? undefined : rating)}
        >
            <View style={styles.ratingLeft}>
                {renderStars(rating)}
                <Text style={styles.ratingText}>{label}</Text>
            </View>
            <View style={[styles.radio, selectedRating === rating && styles.radioSelected]}>
                {selectedRating === rating && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Filter</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* Price Range */}
                        <Text style={styles.sectionTitle}>Price Range (Hourly)</Text>
                        <View style={styles.sliderContainer}>
                            <RangeSlider
                                min={100}
                                max={2000}
                                step={50}
                                initialMin={priceRange[0]}
                                initialMax={priceRange[1]}
                                onValuesChange={(min, max) => setPriceRange([min, max])}
                            />
                        </View>


                        {/* Reviews */}
                        <Text style={styles.sectionTitle}>Reviews</Text>
                        <RatingOption rating={4.5} label="4.5 and above" />
                        <RatingOption rating={4.0} label="4.0 - 4.5" />
                        <RatingOption rating={3.5} label="3.5 - 4.0" />
                        <RatingOption rating={3.0} label="3.0 - 3.5" />
                        <RatingOption rating={2.5} label="2.5 - 3.0" />

                        {/* Category */}
                        <Text style={styles.sectionTitle}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                            <TouchableOpacity
                                style={[styles.chip, !selectedCategory && styles.chipSelected]}
                                onPress={() => setSelectedCategory(undefined)}
                            >
                                <Text style={[styles.chipText, !selectedCategory && styles.chipTextSelected]}>All</Text>
                            </TouchableOpacity>
                            {MOCK_CATEGORIES.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[styles.chip, selectedCategory === cat.name && styles.chipSelected]}
                                    onPress={() => setSelectedCategory(selectedCategory === cat.name ? undefined : cat.name)}
                                >
                                    <Text style={[styles.chipText, selectedCategory === cat.name && styles.chipTextSelected]}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Facilities */}
                        <Text style={styles.sectionTitle}>Facilities</Text>
                        <View style={styles.chipGrid}>
                            <TouchableOpacity
                                style={[styles.chip, selectedAmenities.length === 0 && styles.chipSelected]}
                                onPress={() => setSelectedAmenities([])}
                            >
                                <Text style={[styles.chipText, selectedAmenities.length === 0 && styles.chipTextSelected]}>All</Text>
                            </TouchableOpacity>
                            {FACILITIES.map((facility) => (
                                <TouchableOpacity
                                    key={facility}
                                    style={[styles.chip, selectedAmenities.includes(facility) && styles.chipSelected]}
                                    onPress={() => toggleAmenity(facility)}
                                >
                                    <Text style={[styles.chipText, selectedAmenities.includes(facility) && styles.chipTextSelected]}>{facility}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Reset Filter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.background, // White
        height: height * 0.9,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontFamily: typography.fontFamily.bold,
        fontSize: 18,
        color: colors.textPrimary,
    },
    backButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: 16,
        color: colors.textPrimary,
        marginTop: 20,
        marginBottom: 12,
    },
    sliderContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ratingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: 14,
        color: colors.textPrimary,
        marginLeft: 10,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: colors.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    chipScroll: {
        flexDirection: 'row',
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.surface,
        marginRight: 10,
        marginBottom: 10,
    },
    chipSelected: {
        backgroundColor: colors.primary,
    },
    chipText: {
        fontFamily: typography.fontFamily.medium,
        fontSize: 14,
        color: colors.textSecondary,
    },
    chipTextSelected: {
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        marginRight: 10,
        borderRadius: 12,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    resetButtonText: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: 16,
        color: colors.primary,
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        marginLeft: 10,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    applyButtonText: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: 16,
        color: '#FFFFFF',
    },
});
