// src/components/Slideshow.tsx
import React, { useEffect, useState } from 'react';
import ImmichService from '../services/immichService';
import { combineArrays, shuffleArray } from '../helper/helper';

interface SlideshowProps {
    albumIds: string[];
    apiKey: string;
    baseUrl: string;
    slideshowInterval: number;
    albumUpdateInterval: number;
    excludedFileTypes: string[];
}

interface Asset {
    id: string;
}

const Slideshow: React.FC<SlideshowProps> = ({ albumIds, apiKey, baseUrl, slideshowInterval, albumUpdateInterval, excludedFileTypes }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentBase64, setCurrentBase64] = useState<string | null>(null);

    const immichService = new ImmichService(baseUrl, apiKey, excludedFileTypes);

    const fetchAssets = async () => {
        let allAssets: Asset[] = [];
        for (const albumId of albumIds) {
            const albumAssets = await immichService.getAlbumAssets(albumId);
            allAssets = combineArrays(allAssets, albumAssets);
        }
        setAssets(shuffleArray(allAssets));
    };

    const fetchCurrentBase64 = async (assetId: string) => {
        const base64 = await immichService.getImageBase64(assetId);
        setCurrentBase64(base64);
    };

    useEffect(() => {
        console.log('Updating all assets, next Interval', albumUpdateInterval / 1000 / 60, 'min');
        fetchAssets();
        const updateInterval = setInterval(fetchAssets, albumUpdateInterval);
        return () => clearInterval(updateInterval);
    }, [albumIds, apiKey, baseUrl, albumUpdateInterval]);

    useEffect(() => {
        if (assets.length > 0) {
            fetchCurrentBase64(assets[currentIndex].id);
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % assets.length;
                    fetchCurrentBase64(assets[newIndex].id);
                    return newIndex;
                });
            }, slideshowInterval);
            return () => clearInterval(interval);
        }
    }, [assets, slideshowInterval]);

    if (assets.length === 0) return <div>Loading slideshow...</div>;

    return (
        <div className="slideshow">
            {currentBase64 && <img src={currentBase64} alt="Slideshow" />}
        </div>
    );
};

export default Slideshow;
