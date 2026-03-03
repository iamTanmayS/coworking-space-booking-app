import { StyleSheet, Text, View, Image, Pressable, FlatList } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export interface SpaceDetailHeaderGalleryProps {
    images: string[];
}

const SpaceDetailHeaderGallery = ({ images }: SpaceDetailHeaderGalleryProps) => {
    const [selectedImage, setSelectedImage] = React.useState(images[0]);
    const visibleThumbnails = images.slice(0, 4);
    const remainingCount = images.length - 4;

    const renderThumbnail = ({ item, index }: { item: string; index: number }) => {
        const isLastThumbnail = index === 3 && images.length > 4;

        return (
            <Pressable
                onPress={() => setSelectedImage(item)}
                style={styles.thumbnailWrapper}
            >
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{ uri: item }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    {isLastThumbnail && (
                        <View style={styles.overlayContainer}>
                            <Text style={styles.overlayText}>+{remainingCount}</Text>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainImageContainer}>
                <Image
                    source={{ uri: selectedImage }}
                    style={styles.mainImage}
                    resizeMode="cover"
                />

                <View style={styles.thumbnailStrip}>
                    <FlatList
                        data={visibleThumbnails}
                        renderItem={renderThumbnail}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                    />
                </View>
            </View>
        </View>
    );
}

export default SpaceDetailHeaderGallery

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    mainImageContainer: {
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    mainImage: {
        width: '100%',
        height: 220,
    },
    thumbnailStrip: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    thumbnailList: {
        gap: 6,
    },
    thumbnailWrapper: {
        marginRight: 6,
    },
    thumbnailContainer: {
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    thumbnail: {
        width: 48,
        height: 48,
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});