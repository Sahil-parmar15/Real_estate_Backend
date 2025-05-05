const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/profile_pictures";
    if (file.fieldname === "logo") folder = "uploads/logos";
    if (file.fieldname === "image") folder = "uploads/images";

    ensureFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
module.exports = upload;
