// this code is just for upload the image on local folder in middleware folder

import fs from "fs"
import multer from "multer";
import path from "path"
import { fileURLToPath } from 'url';

//here image is uploading into middleware folder we need to fox this in future
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const UPLOAD_DIR = path.join(__dirname, 'uploads', 'images');

// Create directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({

    destination: function(req,file,cb) {
        cb(null,UPLOAD_DIR)
    },
    filename: function (req,file,cb) {
        cb(null,file.originalname)
    }

})

export const upload = multer({
    storage,
})