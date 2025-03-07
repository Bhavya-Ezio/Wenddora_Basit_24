import { Fragment, useState } from "react";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialFormData = {
  storeName: "Super Super SuperMart",
  storeAddress: "New Market Road, Mumbai",
  ownerName: "Rahul Sharma",
  aadharLink: "1234-5678-9999",
  storeGstNumber: "GSTIN123456769",
  createdAt: "2025-03-05T09:24:47.810Z",
  updatedAt: "2025-03-05T18:14:36.160Z",
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
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
      </div>
      <Sheet open={isEditing} onOpenChange={() => setIsEditing(false)}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Edit Store Settings</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
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
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default Settings;
