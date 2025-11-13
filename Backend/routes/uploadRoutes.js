// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const router = express.Router();

// // Storage configuration
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/"); // folder where images will be stored
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
//     );
//   },
// });

// // Only accept image files
// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png|gif/;
//   const extname = filetypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = filetypes.test(file.mimetype);
//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb("Images only!");
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// // POST /api/upload
// router.post("/", upload.single("image"), (req, res) => {
//   res.send({
//     message: "Image uploaded successfully",
//     imagePath: `/uploads/${req.file.filename}`,
//   });
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully",
    imagePath: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
