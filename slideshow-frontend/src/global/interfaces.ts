export interface Asset {
  id: string;
  originalFileName: string;
  city: string;
  dateTimeOriginal: Date;
  exifImageWidth: number;
  exifImageHeight: number;
  orientation: number;
  type: "IMAGE" | "VIDEO";
}

export interface Config {
  IMMICH_API_BASE_URL: string,
  OPENWEATHERMAP_API_KEY: string,
  IMMICH_ALBUM_IDS: string[],
  EXCLUDED_FILE_TYPES: string[],
  SLIDESHOW_INTERVAL_SECONDS: number,
  ALBUM_UPDATE_INTERVAL_MINUTES: number,
  FALLBACK_COORDINATES: {latitude: number, longitude: number}
}