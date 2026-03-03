import About, { AboutProps } from '@/components/screen_components/space/tabnavigation/About';
import Gallery, { GalleryProps } from '@/components/screen_components/space/tabnavigation/Gallery';
import ReviewTab, { ReviewProps } from '@/components/screen_components/space/tabnavigation/Review';
import * as React from 'react';
import { useWindowDimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabView, Route, TabBar } from 'react-native-tab-view';
import { colors, typography } from '@/index';

interface TabViewExampleProps {
    aboutProps: AboutProps;
    reviewProps: ReviewProps;
    galleryProps: GalleryProps
}

const routes: Route[] = [
    { key: 'first', title: 'About' },
    { key: 'second', title: 'Gallery' },
    { key: "third", title: "Review" }
];

export default function SpaceTabView({ aboutProps, reviewProps, galleryProps }: TabViewExampleProps) {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);

    const renderScene = ({ route }: { route: Route }) => {
        switch (route.key) {
            case 'first':
                return <About {...aboutProps} />;
            case 'second':
                return <Gallery {...galleryProps} />;
            case 'third':
                return <ReviewTab {...reviewProps} />;
            default:
                return null;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.label}
            activeColor={colors.primary}
            inactiveColor={colors.textSecondary}
            pressColor="transparent"
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderBottomColor: colors.border,
        paddingHorizontal: 20,
    },
    indicator: {
        backgroundColor: colors.primary,
        height: 2,
    },
    label: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.sm,
        textTransform: 'none',
        fontWeight: '500',
    },
});