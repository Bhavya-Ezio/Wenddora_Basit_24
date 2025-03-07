const express = require("express");
const router = express.Router();
const kycController = require("../../controllers/admin/kycController");
const { upload } = require("../../helpers/upload"); // ✅ Correct import

// ✅ Ensure multer `upload.fields()` works correctly
router.post(
  "/submit",
  upload.fields([{ name: "aadhaarFront" }, { name: "aadhaarBack" }, { name: "panCard" }]),
  kycController.submitKYC
);

router.get("/all", kycController.getAllKYCs);
router.post("/verify", kycController.verifyKYC);
router.get("/status/:id", kycController.getKYCStatus);

module.exports = router;
