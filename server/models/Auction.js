const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  startPrice: Number,
  currentPrice: Number,
  bidIncrement: Number,
  highestBidder: String,
  status: { type: String, enum: ["scheduled", "active", "closed"], default: "scheduled" },
  startTime: Date,
  endTime: Date,
  bids: [{ user: String, amount: Number }],
});

module.exports = mongoose.model("Auction", auctionSchema);
