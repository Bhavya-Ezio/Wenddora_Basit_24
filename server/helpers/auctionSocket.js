const Auction = require("../models/Auction.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join an auction room
    // socket.on("joinAuction", async ({ auctionId }) => {
    //   socket.join(auctionId);
    //   console.log(`User joined auction room: ${auctionId}`);
    // });

    // // Place a bid
    // socket.on("placeBid", async ({ auctionId, user, amount }) => {
    //   const auction = await Auction.findById(auctionId);
    //   if (!auction || auction.status !== "active") return;

    //   if (amount < auction.currentPrice + auction.bidIncrement) {
    //     socket.emit("bidRejected", { message: "Bid must be at least the set increment!" });
    //     return;
    //   }

    //   // Update highest bid
    //   auction.currentPrice = amount;
    //   auction.highestBidder = user;
    //   auction.bids.push({ user, amount });
    //   await auction.save();

    //   io.to(auctionId).emit("newBid", { user, amount });
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
