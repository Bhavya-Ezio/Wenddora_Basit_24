const mongoose = require("mongoose");

const SellerKYCSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  businessName: { type: String, required: true },
  aadhaarNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  documents: {
    aadhaarFront: { type: String, required: true },
    aadhaarBack: { type: String, required: true },
    panCard: { type: String, required: true },
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }, // ✅ Store review date
  adminRemarks: { type: String }, // ✅ Admin remarks on verification
});

module.exports = mongoose.model("SellerKYC", SellerKYCSchema);
