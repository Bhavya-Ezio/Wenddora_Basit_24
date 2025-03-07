const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const storeRoutes = require("./routes/admin/admin-route");
const auctionRouter = require("./routes/admin/auction-routes");

mongoose
  .connect("mongodb+srv://bashem208:bashem2024@cluster0.8o8bm.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/admin-store", storeRoutes);
app.use("/api/auction", auctionRouter);
app.use("/api/kyc", require("./routes/admin/kycRoutes"));

// Store active auctions
const activeAuctions = {};

// Socket.io for Auctions
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins an auction room
  socket.on("joinAuction", ({ auctionId, userId }) => {
    socket.join(auctionId);
    console.log(`User ${userId} joined auction ${auctionId}`);
  });

  // Handle bidding process
  socket.on("placeBid", ({ auctionId, userId, bidAmount }) => {
    if (!activeAuctions[auctionId]) {
      activeAuctions[auctionId] = { highestBid: 0, highestBidder: null };
    }

    const currentAuction = activeAuctions[auctionId];

    if (bidAmount > currentAuction.highestBid) {
      currentAuction.highestBid = bidAmount;
      currentAuction.highestBidder = userId;
      console.log(socket.id)
      io.emit("newHighestBid", {
        highestBid: bidAmount,
        highestBidder: userId,
      });

      console.log(`User ${userId} placed highest bid of ${bidAmount}`);
    }
  });

  // Handle auction end
  socket.on("endAuction", ({ auctionId }) => {
    const winner = activeAuctions[auctionId]?.highestBidder;
    if (winner) {
      io.to(auctionId).emit("auctionWinner", {
        winner,
        winningBid: activeAuctions[auctionId].highestBid,
      });
      console.log(`Auction ${auctionId} ended. Winner: ${winner}`);
    }
    delete activeAuctions[auctionId];
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
