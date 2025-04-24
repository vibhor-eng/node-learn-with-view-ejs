import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // FIXED HERE
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads', 'images'); // Added '..' to go up one directory if needed

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage });
