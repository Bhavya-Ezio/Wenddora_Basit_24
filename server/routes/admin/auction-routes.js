const auctionController = require("../../controllers/admin/auctionController.js");
const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller.js");
const router = express.Router();

// Define routes
router.post("/auctions", auctionController.createAuction);
router.get("/auctions", auctionController.getAllAuctions);
router.get("/auctions/:id", authMiddleware, auctionController.getAuction);

module.exports = router;

