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