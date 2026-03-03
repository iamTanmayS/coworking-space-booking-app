import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    initialMin?: number;
    initialMax?: number;
    onValuesChange?: (min: number, max: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
    min,
    max,
    step = 1,
    initialMin = min,
    initialMax = max,
    onValuesChange,
}) => {
    const [minVal, setMinVal] = React.useState(initialMin);
    const [maxVal, setMaxVal] = React.useState(initialMax);

    const handleMinChange = (value: number) => {
        const newMin = Math.min(value, maxVal - step);
        setMinVal(newMin);
        onValuesChange?.(newMin, maxVal);
    };

    const handleMaxChange = (value: number) => {
        const newMax = Math.max(value, minVal + step);
        setMaxVal(newMax);
        onValuesChange?.(minVal, newMax);
    };

    return (
        <View style={styles.container}>
            <View style={styles.sliderRow}>
                <Text style={styles.label}>Min: ₹{minVal}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    value={minVal}
                    onValueChange={handleMinChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                />
            </View>

            <View style={styles.sliderRow}>
                <Text style={styles.label}>Max: ₹{maxVal}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    value={maxVal}
                    onValueChange={handleMaxChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    sliderRow: {
        marginBottom: 15,
    },
    label: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
