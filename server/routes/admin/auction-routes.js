const auctionController = require("../../controllers/admin/auctionController.js");
const express = require("express");
const router = express.Router();

// Define routes
router.post("/auctions", auctionController.createAuction);
router.get("/auctions", auctionController.getAllAuctions);
router.get("/auctions/:id", auctionController.getAuction);

module.exports = router;

