const SellerKYC = require("../../models/SellerKYC");
const { imageUploadUtil } = require("../../helpers/upload");

// ✅ Submit KYC (Anyone can submit)
exports.submitKYC = async (req, res) => {
  try {
    console.log(req.body)
    const { fullName, businessName, aadhaarNumber, panNumber, address, userId } = req.body;

    if (!req.files || !req.files["aadhaarFront"] || !req.files["aadhaarBack"] || !req.files["panCard"]) {
      return res.status(400).json({ success: false, message: "All KYC documents are required." });
    }

    // ✅ Debugging: Check if files are being received
    // console.log("Received Files:", req.files);

    // ✅ Ensure file buffers are not empty
    if (
      !req.files["aadhaarFront"][0].buffer ||
      !req.files["aadhaarBack"][0].buffer ||
      !req.files["panCard"][0].buffer
    ) {
      return res.status(400).json({ success: false, message: "File buffers are empty." });
    }

    console.log(userId)
    console.log("Uploading to Cloudinary...");

    const aadhaarFrontUrl = await imageUploadUtil(req.files["aadhaarFront"][0].buffer, "aadhaarFront");
    const aadhaarBackUrl = await imageUploadUtil(req.files["aadhaarBack"][0].buffer, "aadhaarBack");
    const panCardUrl = await imageUploadUtil(req.files["panCard"][0].buffer, "panCard");

    const newKYC = new SellerKYC({
      fullName,
      businessName,
      aadhaarNumber,
      panNumber,
      address,
      documents: {
        aadhaarFront: aadhaarFrontUrl,
        aadhaarBack: aadhaarBackUrl,
        panCard: panCardUrl,
      },
      userId: userId,
    });

    await newKYC.save();
    res.status(201).json({ success: true, message: "KYC submitted successfully!", documents: newKYC.documents });
  } catch (error) {
    console.error("KYC Submission Error:", error);
    res.status(500).json({ success: false, message: "KYC submission failed", error });
  }
};

// ✅ Get All KYC Submissions (For Admin Review)
exports.getAllKYCs = async (req, res) => {
  try {
    const kycs = await SellerKYC.find();
    res.json({ success: true, kycs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching KYC data" });
  }
};

// ✅ Admin Verifies KYC (Approve or Reject)
exports.verifyKYC = async (req, res) => {
  try {
    const { kycId, status, adminRemarks } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status. Use 'verified' or 'rejected'." });
    }

    const kyc = await SellerKYC.findByIdAndUpdate(
      kycId,
      { status, adminRemarks, reviewedAt: new Date() },
      { new: true }
    );

    if (!kyc) return res.status(404).json({ success: false, message: "KYC not found" });

    res.json({ success: true, message: `KYC ${status} successfully`, kyc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying KYC" });
  }
};

exports.getKYCStatus = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Get user ID from URL
    // console.log("id: ", id);

    // ✅ Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid KYC ID format" });
    }

    const kyc = await SellerKYC.find({ userId: id });
    if (!kyc) {
      return res.status(404).json({ success: false, message: "KYC record not found" });
    }

    return res.json({ success: true, status: kyc.status, kyc: kyc[0] });
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    return res.status(500).json({ success: false, message: "Error fetching KYC status", error });
  }
};
