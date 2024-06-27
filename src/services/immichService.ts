// src/services/immichService.ts
import axios from 'axios';

interface Asset {
  id: string;
  originalFileName: string;
}

class ImmichService {
  private baseUrl: string;
  private apiKey: string;
  private excludedFileTypes: string[];

  constructor(baseUrl: string, apiKey: string, excludedFileTypes: string[]) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.excludedFileTypes = excludedFileTypes;
  }

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
    };
  }

  public async getAlbumAssets(albumId: string): Promise<Asset[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/albums/${albumId}`, {
        headers: this.getHeaders(),
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
      }));
    } catch (error) {
      console.error(`Error fetching assets for album ${albumId}`, error);
      return [];
    }
  }

  public async getImageBase64(assetId: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/assets/${assetId}/original`, {
        headers: this.getHeaders(),
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
}

export default ImmichService;
