const Auction = require("../../models/Auction.js");

// Create Auction (Admin)
exports.createAuction = async (req, reply) => {
  try {
    const { itemName, description, startPrice, bidIncrement, startTime, endTime } = req.body;
    const auction = new Auction({
      itemName,
      description,
      startPrice,
      currentPrice: startPrice,
      bidIncrement,
      startTime,
      endTime,
      status: new Date(startTime) > new Date() ? "scheduled" : "active",
    });
    await auction.save();
    reply.send({ message: "Auction created successfully", auction });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
};

// Get All Auctions
exports.getAllAuctions = async (req, reply) => {
  const auctions = await Auction.find();
  reply.send(auctions);
};

// Get Single Auction
exports.getAuction = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ status: "error", message: "Auction not found" });
    return res.status(200).json({ status: "success", auction: auction, userId: userId });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};