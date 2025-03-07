import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();

  const handleBuyerSelection = () => {
    navigate("/auth/register"); // Redirect to buyer registration
    console.log("buyer")
  };

  const handleSellerSelection = () => {
    navigate("/auth/seller-signup"); // Redirect to seller registration
    console.log("seller")
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-black flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold">Welcome to ECommerce Shopping</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Choose Your Role</h2>
          <div className="space-y-4">
            <Button
              className="w-64"
              variant="default"
              onClick={handleBuyerSelection}
            >
              I want to be a Buyer
            </Button>
            <Button
              className="w-64"
              variant="default"
              onClick={handleSellerSelection}
            >
              I want to be a Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;