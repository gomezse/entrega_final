import multer from "multer";
import { __dirname } from "../utils/utils.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    if (file.fieldname === "profiles") {
      return cb(null, `${__dirname}/documents/profiles`);
    } else if (file.fieldname === "products") {
      return cb(null, `${__dirname}/documents/products`);
    } else {
      return cb(null, `${__dirname}/documents/documents`);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);    
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;