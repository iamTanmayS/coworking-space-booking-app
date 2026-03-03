import { useState } from 'react';

export const useReviewCardViewModel = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleDescription = () => setIsExpanded(!isExpanded);

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImageIndex(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return {
        isExpanded,
        selectedImageIndex,
        modalVisible,
        toggleDescription,
        openImageModal,
        closeImageModal,
        formatDate,
    };
};
