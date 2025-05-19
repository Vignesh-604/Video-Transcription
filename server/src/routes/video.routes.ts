import express from "express"
import multer from "multer"
import path from "path"
import { handleUpload } from "../controllers/video.controller"

const router = express.Router()
const storage = multer.diskStorage({
  destination: './public/temp',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', upload.single('video'), handleUpload);

export default router;