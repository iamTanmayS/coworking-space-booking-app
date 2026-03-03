import { StyleSheet, View, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import SpaceDetailHeaderGallery from './SpaceDetailHeaderGallery'
import FavoriteButton from '@/components/reusable_components/Buttons/FavoriteButton'
import ShareButton from '@/components/reusable_components/Buttons/ShareButton'
import { Icon } from '@/components'
import { colors, shadow, radius } from '@/index'

export interface SpaceDetailHeaderProps {
    images: string[],
    spaceId: string,
    isFavourite: boolean
}

const SpaceDetailHeader = ({ images, spaceId, isFavourite }: SpaceDetailHeaderProps) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <SpaceDetailHeaderGallery images={images} />

            <View style={styles.overlayActions}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.actionButton}
                >
                    <Icon
                        name="arrow-back"
                        library="material"
                        size={24}
                        color={colors.textPrimary}
                    />
                </Pressable>

                <View style={styles.rightActions}>
                    <ShareButton spaceId={spaceId} />
                    <FavoriteButton spaceId={spaceId} isFavorite={isFavourite} />
                </View>
            </View>
        </View>
    )
}

export default SpaceDetailHeader

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    overlayActions: {
        position: 'absolute',
        top: 24, // Adjust based on status bar and desired top padding
        left: 32, // Gallery horizontal margin (16) + internal padding (16)
        right: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
    rightActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        backgroundColor: colors.background,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        ...shadow.sm,
    },
})