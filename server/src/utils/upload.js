const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimeValid = allowedTypes.test(file.mimetype);
    if (isExtValid && isMimeValid) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
});

const uploadImageToCloudinary = async (file, folderName = "LoveMate") => {
  try {
    if (!file || !file.path) throw new Error("Missing file path");

    const result = await cloudinary.uploader.upload(file.path, {
      folder: folderName,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

module.exports = { upload, uploadImageToCloudinary };
