import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Pressable, Dimensions } from "react-native";
import ImageModal from "@/components/reusable_components/ImageModal";

const { width, height } = Dimensions.get("window");
const IMAGE_SIZE = width / 2 - 15;

export interface GalleryProps {
    images: string[]
}

export default function Gallery({ images }: GalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (index: number) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImageIndex(null);
    };



    return (
        <>
            <FlatList
                data={images}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.container}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => openModal(index)}>
                        <Image source={{ uri: item }} style={styles.image} />
                    </Pressable>
                )}
            />

            {selectedImageIndex !== null && (
                <ImageModal
                    visible={modalVisible}
                    images={images}
                    initialIndex={selectedImageIndex}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 100, // Extra padding to account for bottom price bar
    },
    image: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 12,
        marginBottom: 10,
    },

});
