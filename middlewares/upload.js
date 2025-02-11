// Import necessary modules
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the absolute path to the 'uploads' directory in your root server folder
const uploadDir = path.resolve(__dirname, "../uploads"); // Ensure absolute path

// Ensure the uploads directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.error("Error creating uploads directory:", error);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    let mimeType = file.mimetype;
    let defaultExt = ext || ""; // Use existing extension if available

    // Assign correct extensions if missing
    if (!ext) {
      if (mimeType === "image/jpeg") defaultExt = ".jpg";
      else if (mimeType === "image/png") defaultExt = ".png";
      else if (mimeType === "image/gif") defaultExt = ".gif";
      else if (mimeType === "video/mp4") defaultExt = ".mp4";
      else if (mimeType === "video/webm") defaultExt = ".webm";
      else if (mimeType === "video/avi") defaultExt = ".avi";
      else {
        return cb(new Error("Unsupported file type"), false);
      }
    }

    // Generate a unique filename (timestamp-based)
    const filename = `${Date.now()}-${file.originalname
      .replace(/\s+/g, "_")
      .toLowerCase()}${defaultExt}`;

    cb(null, filename);
  },
});

// File filter to allow only specific formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/avi",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error("Unsupported file type"), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit (adjust as needed)
  },
});

// Export the upload middleware to be used in routes
export { upload };
