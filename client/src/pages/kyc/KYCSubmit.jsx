import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  businessName: z.string().min(1, "Business name is required"),
  aadhaarNumber: z.string().min(12, "Valid Aadhaar number is required").max(12),
  panNumber: z.string().min(10, "Valid PAN number is required").max(10),
  address: z.string().min(1, "Address is required"),
  aadhaarFront: z.any(),
  aadhaarBack: z.any(),
  panCard: z.any(),
});

const KYCSubmit = () => {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      aadhaarNumber: "",
      panNumber: "",
      address: "",
      aadhaarFront: null,
      aadhaarBack: null,
      panCard: null,
    },
  });

  const handleFileChange = (e, field) => {
    form.setValue(field, e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();
    
    Object.keys(data).forEach((key) => {
      formDataToSend.append(key, data[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/kyc/submit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast({
        title: "Success",
        description: response.data.message || "KYC submitted successfully",
        variant: "success",
      });
      
      form.reset();
      document.getElementById("kyc-form").reset();
    } catch (error) {
      console.error(error);
      
      toast({
        title: "Error",
        description: "KYC submission failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">KYC Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="kyc-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="aadhaarNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Aadhaar Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PAN Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Aadhaar Front</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, "aadhaarFront")} 
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormItem>
                  <FormLabel>Aadhaar Back</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, "aadhaarBack")} 
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormItem>
                  <FormLabel>PAN Card</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => handleFileChange(e, "panCard")} 
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              
              <Button type="submit" className="w-full">Submit KYC</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCSubmit;