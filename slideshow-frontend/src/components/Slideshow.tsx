import React, { useCallback, useEffect, useState } from 'react';
import ImmichService from '../services/immichService';
import { combineArrays, getGradientForBothSides, shuffleArray } from '../global/helper';
import { Asset } from '../global/interfaces';

interface SlideshowProps {
    albumIds: string[];
    baseUrl: string;
    slideshowInterval: number;
    albumUpdateInterval: number;
    excludedFileTypes: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ albumIds, baseUrl, slideshowInterval, albumUpdateInterval, excludedFileTypes }) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentBase64, setCurrentBase64] = useState<string | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [isPortrait, setIsPortrait] = useState(false);
    const [currentAssetCreationDate, setCurrentAssetCreationDate] = useState<string | null>(null);
    const [currentAssetLocation, setCurrentAssetLocation] = useState<string | null>(null);
    const [currentGradientColors, setGradientColors] = useState<{ left: string; right: string; } | null | undefined>(null);

    const immichService = new ImmichService(baseUrl, excludedFileTypes);

    const fetchAssets = useCallback(async () => {
        let allAssets: Asset[] = [];
        for (const albumId of albumIds) {
            const albumAssets = await immichService.getAlbumAssets(albumId);
            allAssets = combineArrays(allAssets, albumAssets);
        }
        setAssets(shuffleArray(allAssets));
    }, [albumIds, immichService]);

    const updateCurrentImageData = useCallback(async (asset: Asset) => {
        try {
            if (asset.type === 'IMAGE') {
                const base64 = await immichService.getImageBase64(asset.id);
                const gradientColors = await getGradientForBothSides(base64, asset.exifImageWidth);
                setCurrentBase64(base64);
                setCurrentVideoUrl(null);
                setGradientColors(gradientColors);
            } else if (asset.type === 'VIDEO') {
                const videoUrl = await immichService.getVideoUrl(asset.id);
                const gradientColors = await getGradientForBothSides(videoUrl, asset.exifImageWidth, 'VIDEO');
                setCurrentVideoUrl(videoUrl);
                setCurrentBase64(null);
                setGradientColors(gradientColors);
            }
            switch (asset.orientation) {
                case 5:
                case 6:
                case 7:
                case 8:
                    setIsPortrait(true);
                    break;
                default:
                    setIsPortrait(asset.exifImageHeight > asset.exifImageWidth);
                    break;
            };
            setCurrentAssetLocation(asset.city);
            setCurrentAssetCreationDate(asset.dateTimeOriginal.toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }));
        } catch (e) {
            console.error(e);
        }
    }, [immichService]);

    useEffect(() => {
        console.log('Updating all assets, next Interval', albumUpdateInterval / 1000 / 60, 'min');
        fetchAssets();
        const updateInterval = setInterval(fetchAssets, albumUpdateInterval);
        return () => clearInterval(updateInterval);
    }, [albumIds, baseUrl, albumUpdateInterval]);

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

    const customStyles: React.CSSProperties = isPortrait && currentGradientColors ? {
        '--gradient-left': currentGradientColors.left,
        '--gradient-right': currentGradientColors.right,
    } as React.CSSProperties : {};

    return (
        <div className="fade-in" key={currentBase64 || currentVideoUrl}>
            <div
                className={`slideshow${isPortrait ? ' portrait' : ''}`}
                style={customStyles}>
                {currentBase64 && <img src={currentBase64} alt="Slideshow" />}
                {currentVideoUrl && (
                    <video controls autoPlay loop muted >
                        <source src={currentVideoUrl} type="video/mp4" />
                    </video>
                )}
                <div className="overlay">
                    <div>{currentAssetLocation}</div>
                    <div>{currentAssetCreationDate}</div>
                </div>
            </div>
        </div>
    );
};

export default Slideshow;
