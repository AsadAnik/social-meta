import cloudinary from "../../config/cloudninary";

// Define UploadApiResponse manually (if not available from the library)
interface UploadApiResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  [key: string]: any; // To handle additional unexpected fields
}

/**
 * Upload file to Cloudinary
 * @param filePath - Path of the file to upload
 * @param folder - Folder name in Cloudinary
 * @returns - Cloudinary upload result
 */
const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto", // Automatically detect file type
    });
    return result as unknown as UploadApiResponse;
  } catch (error: any) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};
export default uploadToCloudinary;