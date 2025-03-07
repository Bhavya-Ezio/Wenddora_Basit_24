const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    storeAddress: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    aadharLink: {
      type: String,
      required: true,
      trim: true,
    },
    storeGstNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;
