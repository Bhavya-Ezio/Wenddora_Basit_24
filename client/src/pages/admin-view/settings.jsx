import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const initialFormData = {
  storeName: "Super Super SuperMart",
  storeAddress: "New Market Road, Mumbai",
  ownerName: "Rahul Sharma",
  aadharLink: "1234-5678-9999",
  storeGstNumber: "GSTIN123456769",
};

const Settings = ({ storeData = initialFormData }) => {
  const [formData, setFormData] = useState(storeData);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    setIsEditing(false);
    toast({ title: "Settings updated successfully" });
  };

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
            {Object.entries(formData).map(([key, value]) => (
              <Card key={key} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground capitalize block">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-lg font-medium break-words">{value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={isEditing} onOpenChange={() => setIsEditing(false)}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Edit Store Settings</SheetTitle>
          </SheetHeader>
          <div className="grid gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            ))}
            <Button onClick={handleSave} className="w-full mt-6">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default Settings;