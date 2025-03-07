import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ArrowRight, Package, Timer, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auction/auctions');
        console.log(response.data);
        setAuctions(response.data);
      } catch (err) {
        console.error('Failed to fetch auctions', err);
        toast({
          variant: "destructive",
          title: "Error fetching auctions",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="w-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-6 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-12 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Live Auctions</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auctions.map((auction) => (
          <Card 
            key={auction._id} 
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="border-b bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    {auction.itemName}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge 
                      variant={auction.status === "active" ? "success" : "secondary"}
                      className="text-base"
                    >
                      {auction.status}
                    </Badge>
                    <Badge variant="outline" className="text-base">
                      Increment: ${auction.bidIncrement}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Item Description */}
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    {auction.description}
                  </p>
                </div>
              </div>

              {/* Price Information */}
              <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-lg font-medium">Current Price</span>
                  </div>
                  <div className="text-2xl font-bold text-primary flex items-center gap-1">
                    <DollarSign className="h-6 w-6" />
                    {auction.currentPrice || auction.startPrice}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span>Starting Price: ${auction.startPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>
                      Ends: {new Date(auction.endTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/30 p-6">
              <Button 
                className="w-full text-lg py-6"
                onClick={() => navigate(`/auction/${auction._id}`)}
              >
                View Auction Details
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {auctions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-xl text-muted-foreground">
            No active auctions available at the moment
          </p>
        </Card>
      )}
    </div>
  );
};

export default Auctions;