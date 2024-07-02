import React, { useEffect, useState } from 'react';
import ImmichService from '../services/immichService';
import { combineArrays, shuffleArray } from '../global/helper';
import { Asset } from '../global/interfaces';

interface SlideshowProps {
    albumIds: string[];
    apiKey: string;
    baseUrl: string;
    slideshowInterval: number;
    albumUpdateInterval: number;
    excludedFileTypes: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ albumIds, apiKey, baseUrl, slideshowInterval, albumUpdateInterval, excludedFileTypes }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentBase64, setCurrentBase64] = useState<string | null>(null);
    const [isPortrait, setIsPortrait] = useState(false);
    const [currentAssetCreationDate, setCurrentAssetCreationDate] = useState<string | null>(null);
    const [currentAssetLocation, setCurrentAssetLocation] = useState<string | null>(null);

    const immichService = new ImmichService(baseUrl, apiKey, excludedFileTypes);

    const fetchAssets = async () => {
        let allAssets: Asset[] = [];
        for (const albumId of albumIds) {
            const albumAssets = await immichService.getAlbumAssets(albumId);
            allAssets = combineArrays(allAssets, albumAssets);
        }
        setAssets(shuffleArray(allAssets));
    };

    const updateCurrentImageData = async (asset: Asset) => {
        const base64 = await immichService.getImageBase64(asset.id);
        setCurrentBase64(base64);
        setIsPortrait(asset.exifImageHeight > asset.exifImageWidth);
        setCurrentAssetLocation(asset.city);
        setCurrentAssetCreationDate(asset.dateTimeOriginal.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }));
    };

    useEffect(() => {
        console.log('Updating all assets, next Interval', albumUpdateInterval / 1000 / 60, 'min');
        fetchAssets();
        const updateInterval = setInterval(fetchAssets, albumUpdateInterval);
        return () => clearInterval(updateInterval);
    }, [albumIds, apiKey, baseUrl, albumUpdateInterval]);

    useEffect(() => {
        if (assets.length > 0) {
            updateCurrentImageData(assets[currentIndex]);
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % assets.length;
                    updateCurrentImageData(assets[newIndex]);
                    return newIndex;
                });
            }, slideshowInterval);
            return () => clearInterval(interval);
        }
    }, [assets, slideshowInterval]);

    if (assets.length === 0) return <div>Loading slideshow...</div>;

    return (
        <div className="fade-in" key={currentBase64}>
            <div className={`slideshow${isPortrait ? ' portrait' : ''}`}>
                {currentBase64 && <img src={currentBase64} alt="Slideshow" />}
                <div className="overlay">
                    <div>{currentAssetLocation}</div>
                    <div>{currentAssetCreationDate}</div>
                </div>
            </div>
        </div>
    );
};

export default Slideshow;
