import { Fragment, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useSelector } from "react-redux";

const Settings = () => {
  const [kycData, setKycData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/kyc/status/${user.id}`);
        setKycData(response.data.kyc);
      } catch (error) {
        console.error("Error fetching store data:", error);
        toast({ title: "Error fetching store data", variant: "destructive" });
      }
    };

    fetchStoreData();
  }, []);

  // Define the fields we want to display and their labels
  const displayFields = [
    { key: 'businessName', label: 'Business Name' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number' },
    { key: 'panNumber', label: 'PAN Number' },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'KYC Status' },
  ];

  return (
    <Fragment>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Store Profile</CardTitle>
            <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Settings
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            {displayFields.map(({ key, label }) => (
              <Card key={key} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <Label className="text-lg font-medium text-muted-foreground capitalize block">
                    {label}
                  </Label>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xl font-medium break-words">
                      {kycData?.[key] || "Not provided"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Documents Section */}
            {/* {kycData?.documents && (
              <>
                <Card className="p-4 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <Label className="text-lg font-medium text-muted-foreground block mb-4">
                    Documents
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-base text-muted-foreground">Aadhaar Front</p>
                      <img 
                        src={kycData.documents.aadhaarFront} 
                        alt="Aadhaar Front"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-base text-muted-foreground">Aadhaar Back</p>
                      <img 
                        src={kycData.documents.aadhaarBack} 
                        alt="Aadhaar Back"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <p className="text-base text-muted-foreground">PAN Card</p>
                      <img 
                        src={kycData.documents.panCard} 
                        alt="PAN Card"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                </Card>
              </>
            )} */}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isEditing} onOpenChange={() => setIsEditing(false)}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-4">
            <SheetTitle>Edit Store Settings</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4">
            {displayFields.map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-lg font-medium capitalize">
                  {label}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={kycData?.[key] || ''}
                  onChange={(e) => setKycData({ ...kycData, [e.target.name]: e.target.value })}
                  className="w-full text-base py-5"
                />
              </div>
            ))}
            <Button 
              onClick={() => {
                console.log("Updated Data:", kycData);
                setIsEditing(false);
                toast({ title: "Settings updated successfully" });
              }} 
              className="w-full mt-4 text-lg py-5"
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default Settings;