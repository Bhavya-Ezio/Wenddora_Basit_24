import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket, { joinAuction, placeBid } from "../../socket/socket";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, Timer, Users, TrendingUp, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSelector } from "react-redux";

const AuctionComponent = () => {
  const { id } = useParams();
  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  // Fetch auction data
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:5000/api/auction/auctions/${id}`, { withCredentials: true });
        setAuctionData(response.data.auction);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch auction details:', error);
        toast({
          variant: "destructive",
          title: "Error loading auction",
          description: "Failed to load auction details",
        });
        setLoading(false);
      }
    };

    fetchAuctionData();
  }, [id]);

  // Socket connection
  useEffect(() => {
    if (!auctionData) return;

    joinAuction(id, user.id);

    socket.on("connect", () => {
      toast({
        title: "Connected to auction",
        description: "You're now connected to the live auction",
      });
    });

    socket.on("newHighestBid", ({ highestBid, highestBidder }) => {
      setAuctionData(prev => ({
        ...prev,
        currentPrice: highestBid,
        highestBidder: highestBidder
      }));
      toast({
        title: "New Highest Bid!",
        description: `${highestBidder} placed a bid of $${highestBid}`,
        variant: highestBidder === user.id ? "default" : "destructive",
      });
    });

    return () => {
      socket.off("connect");
      socket.off("newHighestBid");
      socket.off("auctionWinner");
    };
  }, [auctionData, id, user.id]);

  const handleBid = () => {
    if (!bidAmount) {
      toast({
        variant: "destructive",
        title: "Invalid bid",
        description: "Please enter a bid amount",
      });
      return;
    }

    const minValidBid = auctionData.currentPrice + auctionData.bidIncrement;
    if (Number(bidAmount) < minValidBid) {
      toast({
        variant: "destructive",
        title: "Invalid bid",
        description: `Bid must be at least $${minValidBid} (current price + minimum increment)`,
      });
      return;
    }

    placeBid(id, user.id, Number(bidAmount));
    setBidAmount("");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="border-b">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{auctionData?.itemName}</CardTitle>
              <Badge variant="outline" className="text-lg">
                Status: {auctionData?.status}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-lg">
                <Users className="w-4 h-4 mr-2" />
                Highest Bidder: {auctionData?.highestBidder || "No bids yet"}
              </Badge>
              <Badge variant="outline" className="text-base">
                Bid Increment: ${auctionData?.bidIncrement}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-6 space-y-6">
          {/* Item Details */}
          <div className="bg-muted/20 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5" />
              <p className="text-lg text-muted-foreground">{auctionData?.description}</p>
            </div>
          </div>

          {/* Current Bid Section */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Current Price
              </h3>
              <div className="text-3xl font-bold text-primary flex items-center">
                <DollarSign className="w-8 h-8" />
                {auctionData?.currentPrice}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center text-muted-foreground">
              <div className="flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Start: ${auctionData?.startPrice}
              </div>
              <div>
                End Time: {new Date(auctionData?.endTime).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bid Input Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Place Your Bid</h3>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={`Minimum bid: $${(auctionData?.currentPrice || 0) + (auctionData?.bidIncrement || 0)}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="pl-10 text-lg py-6"
                />
              </div>
              <Button
                onClick={handleBid}
                className="text-lg px-8"
                size="lg"
                disabled={auctionData?.status !== "active"}
              >
                Place Bid
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/30 flex justify-between">
          <div className="text-muted-foreground">
            Minimum increment: ${auctionData?.bidIncrement}
          </div>
          <div className="text-muted-foreground">
            Total Bids: {auctionData?.bids?.length || 0}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuctionComponent;
