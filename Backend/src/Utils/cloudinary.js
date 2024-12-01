import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import stream from "stream";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});

// const uploadOnCloudinary = async (file) => {
//     console.log("Attempting to upload file to Cloudinary");

//     return new Promise((resolve, reject) => {
//         // Set a timeout
//         const uploadTimeout = setTimeout(() => {
//             console.error("Cloudinary upload timed out");
//             reject(new Error("Cloudinary upload timed out"));
//         }, 30000); // 30 seconds timeout

//         try {
//             // Validate file
//             if (!file) {
//                 clearTimeout(uploadTimeout);
//                 console.error("No file provided");
//                 return resolve(null);
//             }

//             // Ensure file has a buffer
//             if (!file.buffer) {
//                 clearTimeout(uploadTimeout);
//                 console.error("File does not have a buffer property");
//                 return resolve(null);
//             }

//             // Create upload stream
//             const uploadStream = cloudinary.uploader.upload_stream(
//                 {
//                     resource_type: "auto",
//                 },
//                 (error, result) => {
//                     // Clear the timeout
//                     clearTimeout(uploadTimeout);

//                     if (error) {
//                         console.error("Cloudinary upload error:", error);
//                         return reject(error);
//                     }

//                     if (!result) {
//                         console.error("No result returned from Cloudinary");
//                         return reject(new Error("No result from Cloudinary upload"));
//                     }

//                     console.log("File uploaded successfully:", {
//                         url: result.url,
//                         public_id: result.public_id
//                     });

//                     resolve(result);
//                 }
//             );

//             const passthrough = new stream.PassThrough();
//             passthrough.end(file.buffer);
//             passthrough.pipe(uploadStream);
//         } catch (error) {
//             // Clear the timeout
//             clearTimeout(uploadTimeout);
//             console.error("Unexpected error in uploadOnCloudinary:", error);
//             reject(error);
//         }
//     });
// };

const uploadOnCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { public_id: fileName }, // Optional: specify file name in Cloudinary
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};

function extractCloudinaryPublicId(url) {
    // Use a regular expression to extract the public ID
    const match = url.match(/\/v\d+\/(.+?)(?:\.\w+)?$/);
    
    // Return the matched public ID if found, otherwise return null
    return match ? decodeURIComponent(match[1]) : null;
  }

// const extractPublicId = (url) => {
//     if (!url) return null;
//     try {
//         const parts = url.split("/");
//         const publicIdWithExtension = parts[parts.length - 1];
//         const publicId = publicIdWithExtension.split(".")[0];
//         return publicId;
//     } catch (error) {
//         console.error("Error extracting public ID:", error);
//         return null;
//     }
// };

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) {
            console.error("No URL provided for deletion");
            return null;
        }
        const publicId = extractCloudinaryPublicId(url);

        console.log("Attempting to delete from Cloudinary:", publicId);
        

        if (!publicId) return;

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
