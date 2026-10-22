import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB - PDF notes
  },
  fileFilter(req, file, cb) {
    const allowed = [
      "application/pdf",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB - inline images/diagrams
  },
  fileFilter(req, file, cb) {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPEG, WEBP, GIF, or SVG images are allowed."));
    }
  },
});
