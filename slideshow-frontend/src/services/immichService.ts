// src/services/immichService.ts
import axios from 'axios';
import { Asset } from '../global/interfaces';

class ImmichService {
  private baseUrl: string;
  private excludedFileTypes: string[];

  constructor(baseUrl: string, excludedFileTypes: string[]) {
    this.baseUrl = baseUrl;
    this.excludedFileTypes = excludedFileTypes;
  }

  public async getAlbumAssets(albumId: string): Promise<Asset[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/albums/${albumId}`, {
      });

      console.log('Assets before filtering: ', response.data.assets);

      // Filter assets based on excluded file types
      const filteredAssets = response.data.assets.filter((asset: any) => {
        for (const excludedString of this.excludedFileTypes) {
          if (asset.originalFileName.includes(excludedString)) {
            return false; // Exclude asset if any excluded string is found
          }
        }
        return true; // Include asset if none of the excluded strings are found
      });

      return filteredAssets.map((asset: any) => ({
        id: asset.id,
        originalFileName: asset.originalFileName,
        city: asset.exifInfo.city,
        dateTimeOriginal: new Date(asset.exifInfo.dateTimeOriginal),
        exifImageWidth: asset.exifInfo.exifImageWidth,
        exifImageHeight: asset.exifInfo.exifImageHeight,
        orientation: +asset.exifInfo.orientation,
        type: asset.type
      }));
    } catch (error) {
      console.error(`Error fetching assets for album ${albumId}`, error);
      return [];
    }
  }

  public async getImageBase64(assetId: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/image/${assetId}`, {
        responseType: 'blob',
      });

      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error(`Error fetching image data for asset ${assetId}`, error);
      return null;
    }
  }

  public async getVideoUrl(assetId: string): Promise<string | null> {
    return `${this.baseUrl}/video/${assetId}`;
  }
}

export default ImmichService;
