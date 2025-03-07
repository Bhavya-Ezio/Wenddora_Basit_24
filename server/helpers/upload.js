// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");

// // ✅ Define the upload directory
// const uploadDir = path.join(__dirname, "../uploads");

// // ✅ Ensure "uploads" folder exists before uploading
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir); // ✅ Files will be stored here
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "deutyjakg", // ✅ Hardcoded Cloudinary Cloud Name
  api_key: "363212634931153", // ✅ Hardcoded API Key
  api_secret: "yNgJXvGO4wYG4-iI-OD_TcRfJSo", // ✅ Hardcoded API Secret
});

const storage = multer.memoryStorage(); // ✅ Use memory storage for Cloudinary

const upload = multer({ storage });

// ✅ Upload to Cloudinary
async function imageUploadUtil(fileBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // ✅ Return Cloudinary URL
      }
    ).end(fileBuffer);
  });
}

module.exports = { upload, imageUploadUtil };
