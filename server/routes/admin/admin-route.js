const express = require("express");
const { getAllStores, getStoreByOwner, addStore } = require("../../controllers/admin/admin-controller");
const { updateStore } = require("../../controllers/admin/admin-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller.js");

const router = express.Router();

// Routes using controller functions
router.get("/stores", getAllStores);
router.get("/store/:ownerName", getStoreByOwner);
router.post("/add-store", addStore);
router.put("/store/:storeId",updateStore);

module.exports = router;
