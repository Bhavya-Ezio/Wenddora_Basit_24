import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000"; // Change this if running on a different URL

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // Use WebSockets only for better performance
});

// When client connects to the server
socket.on("connect", () => {
  console.log(`Connected to server with ID: ${socket.id}`);
});

// Listen for new highest bid updates
socket.on("newHighestBid", ({ highestBid, highestBidder }) => {
  console.log(`New highest bid: ${highestBid} by User ${highestBidder}`);
});

// Listen for auction winner announcement
socket.on("auctionWinner", ({ winner, winningBid }) => {
  console.log(`Auction ended! Winner: ${winner} with bid ${winningBid}`);
});

// // Function to join an auction room
export const joinAuction = (auctionId, userId) => {
  socket.emit("joinAuction", { auctionId, userId });
  console.log(`Joined auction ${auctionId}`);
};

// // Function to place a bid
export const placeBid = (auctionId, userId, bidAmount) => {
  socket.emit("placeBid", { auctionId, userId, bidAmount });
  console.log(`Bid placed: ${bidAmount} in auction ${auctionId}`);
};

// Function to end an auction (only admin should call this)
export const endAuction = (auctionId) => {
  socket.emit("endAuction", { auctionId });
  console.log(`Auction ${auctionId} ended`);
};

export default socket;
