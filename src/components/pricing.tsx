import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PackageData {
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  revisions: string;
  includes: string;
}

interface PricingProps {
  formData: {
    pricingModel: string;
    singlePrice: string;
    basicPackage: PackageData;
    standardPackage: PackageData;
    premiumPackage: PackageData;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handlePackageChange: (packageType: "basicPackage" | "standardPackage" | "premiumPackage", field: string, value: string) => void;
}

const StepThreePricing: React.FC<PricingProps> = ({
  formData,
  handleChange,
  setFormData,
  handlePackageChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">Pricing Model</Label>
        <RadioGroup 
          value={formData.pricingModel} 
          onValueChange={(value) => setFormData({...formData, pricingModel: value})}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Single Package</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tiered" id="tiered" />
            <Label htmlFor="tiered">Three Tier Packages</Label>
          </div>
        </RadioGroup>
      </div>
      
      {formData.pricingModel === "single" ? (
        <div>
          <Label htmlFor="singlePrice">Package Price</Label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <Input 
              id="singlePrice"
              name="singlePrice"
              type="number"
              min="5"
              value={formData.singlePrice}
              onChange={handleChange}
              placeholder="e.g., 50"
              required
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Basic Package */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="basicDescription">Description</Label>
                <Textarea 
                  id="basicDescription"
                  value={formData.basicPackage.description}
                  onChange={(e) => handlePackageChange("basicPackage", "description", e.target.value)}
                  placeholder="What's included"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="basicPrice">Price ($)</Label>
                <Input 
                  id="basicPrice"
                  type="number"
                  min="5"
                  value={formData.basicPackage.price}
                  onChange={(e) => handlePackageChange("basicPackage", "price", e.target.value)}
                  placeholder="e.g., 25"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="basicDeliveryTime">Delivery (days)</Label>
                <Input 
                  id="basicDeliveryTime"
                  type="number"
                  min="1"
                  value={formData.basicPackage.deliveryTime}
                  onChange={(e) => handlePackageChange("basicPackage", "deliveryTime", e.target.value)}
                  placeholder="e.g., 3"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="basicRevisions">Revisions</Label>
                <Input 
                  id="basicRevisions"
                  type="number"
                  min="0"
                  value={formData.basicPackage.revisions}
                  onChange={(e) => handlePackageChange("basicPackage", "revisions", e.target.value)}
                  placeholder="e.g., 1"
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Standard Package */}
          <Card>
            <CardHeader>
              <CardTitle>Standard Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="standardDescription">Description</Label>
                <Textarea 
                  id="standardDescription"
                  value={formData.standardPackage.description}
                  onChange={(e) => handlePackageChange("standardPackage", "description", e.target.value)}
                  placeholder="What's included"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="standardPrice">Price ($)</Label>
                <Input 
                  id="standardPrice"
                  type="number"
                  min="5"
                  value={formData.standardPackage.price}
                  onChange={(e) => handlePackageChange("standardPackage", "price", e.target.value)}
                  placeholder="e.g., 50"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="standardDeliveryTime">Delivery (days)</Label>
                <Input 
                  id="standardDeliveryTime"
                  type="number"
                  min="1"
                  value={formData.standardPackage.deliveryTime}
                  onChange={(e) => handlePackageChange("standardPackage", "deliveryTime", e.target.value)}
                  placeholder="e.g., 5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="standardRevisions">Revisions</Label>
                <Input 
                  id="standardRevisions"
                  type="number"
                  min="0"
                  value={formData.standardPackage.revisions}
                  onChange={(e) => handlePackageChange("standardPackage", "revisions", e.target.value)}
                  placeholder="e.g., 3"
                  required
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Package */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="premiumDescription">Description</Label>
                <Textarea 
                  id="premiumDescription"
                  value={formData.premiumPackage.description}
                  onChange={(e) => handlePackageChange("premiumPackage", "description", e.target.value)}
                  placeholder="What's included"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="premiumPrice">Price ($)</Label>
                <Input 
                  id="premiumPrice"
                  type="number"
                  min="5"
                  value={formData.premiumPackage.price}
                  onChange={(e) => handlePackageChange("premiumPackage", "price", e.target.value)}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="premiumDeliveryTime">Delivery (days)</Label>
                <Input 
                  id="premiumDeliveryTime"
                  type="number"
                  min="1"
                  value={formData.premiumPackage.deliveryTime}
                  onChange={(e) => handlePackageChange("premiumPackage", "deliveryTime", e.target.value)}
                  placeholder="e.g., 7"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="premiumRevisions">Revisions</Label>
                <Input 
                  id="premiumRevisions"
                  type="number"
                  min="0"
                  value={formData.premiumPackage.revisions}
                  onChange={(e) => handlePackageChange("premiumPackage", "revisions", e.target.value)}
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StepThreePricing;
