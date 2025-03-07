import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

const AdminKYCReview = () => {
  const [kycList, setKycList] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKYCs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/kyc/all");
        setKycList(response.data.kycs);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error fetching KYC data",
          description: "Please try again later",
        });
      }
    };

    fetchKYCs();
  }, []);

  const handleVerify = async (kycId, status) => {
    try {
      await axios.post("http://localhost:5000/api/kyc/verify", { kycId, status });
      setKycList(kycList.filter(kyc => kyc._id !== kycId));
      toast({
        title: `KYC ${status} successfully`,
        variant: status === "verified" ? "default" : "destructive",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error updating KYC status",
        description: "Please try again",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">KYC Review Dashboard</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kycList.map((kyc) => (
          <Card key={kyc._id} className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="text-xl font-semibold">
                {kyc.businessName}
                <Badge variant="outline" className="ml-2 text-base">
                  Pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-base font-medium text-muted-foreground">Owner Name</p>
                <p className="text-lg font-medium">{kyc.fullName}</p>
              </div>

              <div className="space-y-3">
                <p className="text-base font-medium text-muted-foreground">Documents</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Aadhaar Front</p>
                    <img 
                      src={kyc.documents.aadhaarFront} 
                      alt="Aadhaar Front" 
                      className="w-full h-40 object-cover rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Aadhaar Back</p>
                    <img 
                      src={kyc.documents.aadhaarBack} 
                      alt="Aadhaar Back" 
                      className="w-full h-40 object-cover rounded-md border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">PAN Card</p>
                  <img 
                    src={kyc.documents.panCard} 
                    alt="PAN Card" 
                    className="w-full h-40 object-cover rounded-md border"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 text-base py-6"
                  variant="default"
                  onClick={() => handleVerify(kyc._id, "verified")}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve
                </Button>
                <Button
                  className="flex-1 text-base py-6"
                  variant="destructive"
                  onClick={() => handleVerify(kyc._id, "rejected")}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {kycList.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-lg text-muted-foreground">No pending KYC applications</p>
        </Card>
      )}
    </div>
  );
};

export default AdminKYCReview;
  