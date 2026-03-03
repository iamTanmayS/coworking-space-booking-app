import React, { useEffect } from "react";
import { View, FlatList, Image, Modal, StyleSheet, Pressable, Dimensions, BackHandler, StatusBar } from "react-native";
import { Icon } from "@/components";

const { width, height } = Dimensions.get("window");

export interface ImageModalProps {
    visible: boolean;
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

export default function ImageModal({ visible, images, initialIndex, onClose }: ImageModalProps) {
    useEffect(() => {
        const backAction = () => {
            if (visible) {
                onClose();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <StatusBar hidden={true} />
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Icon name="close" library="ionicons" size={28} color="#FFFFFF" />
                </Pressable>

                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={initialIndex}
                    getItemLayout={(data, index) => (
                        { length: width, offset: width * index, index }
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.fullScreenImageContainer}>
                            <Image
                                source={{ uri: item }}
                                style={styles.fullScreenImage}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
    },
    fullScreenImageContainer: {
        width: width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
    },
    fullScreenImage: {
        width: width,
        height: height,
    },
});
