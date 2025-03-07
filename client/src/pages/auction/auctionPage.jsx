import React, { useEffect, useState } from "react";
import socket,{ joinAuction,placeBid} from "../../socket/socket";

const AuctionComponent = () => {
  const [auctionId, setAuctionId] = useState("auction123");
  const [userId, setUserId] = useState("user1");
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState(0);

  useEffect(() => {
    joinAuction(auctionId, userId);

    socket.on("connect", () => {
      console.log("Connected to auction server");
    });

    socket.on("newHighestBid", ({ highestBid, highestBidder }) => {
      console.log(`New highest bid: ${highestBid} by User ${highestBidder}`);
      setHighestBid(highestBid);
    });

    return () => {
      socket.off("connect");
      socket.off("newHighestBid");
      socket.off("auctionWinner");
    };
  }, [auctionId, userId]);

  const handleBid = () => {
    if (!bidAmount) return alert("Enter a bid amount");
    placeBid(auctionId, userId, Number(bidAmount));
    setBidAmount("");
  };

  return (
    <>
    <div>
    <p>Hello this is auction pages</p>
      <h2>Auction {auctionId}</h2>
      <p>User: {userId}</p>
      <input
        type="number"
        placeholder="Enter bid amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={handleBid}>Place Bid</button>
      <button onClick={() => endAuction(auctionId)}>End Auction</button>
    </div>
    <div>
      <h3>Highest Bid: {highestBid}</h3>
    </div>
    </>
  );
};

export default AuctionComponent;
