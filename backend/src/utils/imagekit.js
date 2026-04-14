import ImageKit from "@imagekit/nodejs";
import { env } from "../config/env.js";

let imagekit = null;

if (env.imagekitPublicKey && env.imagekitPrivateKey && env.imagekitUrlEndpoint) {
  imagekit = new ImageKit({
    publicKey: env.imagekitPublicKey,
    privateKey: env.imagekitPrivateKey,
    urlEndpoint: env.imagekitUrlEndpoint
  });
  console.log("✅ ImageKit CDN connected");
} else {
  console.warn("⚠️  ImageKit credentials missing — image uploads disabled");
}

/**
 * Upload an image buffer to ImageKit.
 * @param {Buffer} fileBuffer  - The image buffer from multer
 * @param {string} fileName    - Original file name
 * @param {string} folder      - ImageKit folder path
 * @returns {Promise<Object>}  - Upload result with url, fileId, thumbnailUrl
 */
export async function uploadImage(fileBuffer, fileName, folder = "/products") {
  if (!imagekit) {
    throw Object.assign(new Error("ImageKit not configured. Set IMAGEKIT credentials in .env"), {
      statusCode: 503
    });
  }

  const result = await imagekit.upload({
    file: fileBuffer,
    fileName: fileName,
    folder: `/bhardwajdeco${folder}`,
    useUniqueFileName: true,
    tags: ["bhardwajdeco"],
    transformation: {
      pre: "f-webp,q-80" // Auto-convert to WebP with 80% quality
    }
  });

  return {
    url: result.url,
    fileId: result.fileId,
    thumbnailUrl: result.thumbnailUrl,
    name: result.name,
    size: result.size,
    width: result.width,
    height: result.height,
    filePath: result.filePath
  };
}

/**
 * Delete an image from ImageKit by fileId.
 * @param {string} fileId - ImageKit file ID
 */
export async function deleteImage(fileId) {
  if (!imagekit || !fileId) return;

  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error(`ImageKit delete failed for ${fileId}:`, error.message);
  }
}

/**
 * Generate an optimized ImageKit URL with transformations.
 * Great for responsive images (thumbnails, cards, hero banners).
 *
 * @param {string} filePath   - ImageKit file path
 * @param {Object} transforms - Transformation options
 * @returns {string}          - Transformed URL
 */
export function getOptimizedUrl(filePath, transforms = {}) {
  if (!imagekit || !filePath) return filePath;

  const {
    width,
    height,
    quality = 80,
    format = "webp",
    crop = "at_max"
  } = transforms;

  const transformation = [{ quality, format }];
  if (width) transformation[0].width = width;
  if (height) transformation[0].height = height;
  if (crop) transformation[0].crop = crop;

  return imagekit.url({
    path: filePath,
    transformation
  });
}

/**
 * Generate ImageKit auth params for client-side uploads (if needed later).
 */
export function getAuthParams() {
  if (!imagekit) return null;
  return imagekit.getAuthenticationParameters();
}

export { imagekit };
