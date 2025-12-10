import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = /jepeg|jpg|png|webp/
    const extName = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})