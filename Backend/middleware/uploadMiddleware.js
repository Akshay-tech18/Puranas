const multer = require('multer');
const path = require('path');

// File Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = file.mimetype.split('/')[0];
    let folder = 'uploads/';

    if (fileType === 'image') folder += 'images';
    else if (fileType === 'audio') folder += 'audio';
    else if (fileType === 'video') folder += 'videos';
    else return cb(new Error('Unsupported file type'), null);

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// File Filter Config
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|m4a|ogg|mp4|avi|mkv/;
  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetypeOk = allowedTypes.test(extname);
  if (mimetypeOk) cb(null, true);
  else cb(new Error('File type not supported'), false);
};

// Multer Init
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});

module.exports = upload;
