require('dotenv').config();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const requiredCloudinaryVariables = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingCloudinaryVariables = requiredCloudinaryVariables.filter(
  variable => !process.env[variable]
);

if (missingCloudinaryVariables.length) {
  throw new Error(
    `Missing Cloudinary environment variable(s): ${missingCloudinaryVariables.join(', ')}`
  );
}

// ✅ Cloudinary Config using .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

// ✅ Upload Middleware
const upload = multer({ storage });

module.exports = upload;
