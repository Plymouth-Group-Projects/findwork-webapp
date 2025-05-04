"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  Clock,
  Repeat,
  DollarSign,
  StarIcon,
  MessageSquare,
  Share2,
  Briefcase,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function CollaborationDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collaboration, setCollaboration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactMessage, setContactMessage] = useState("");
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const fetchCollaboration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/collaboration/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch collaboration details");
      }
      const data = await response.json();
      setCollaboration(data.data);
    } catch (error) {
      console.error("Error fetching collaboration:", error);
      toast({
        title: "Error",
        description: "Failed to load collaboration details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCollaboration();
    }
  }, [id, fetchCollaboration]);

  const handleHire = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to hire this freelancer",
        variant: "destructive",
      });
      router.push("/auth/login");
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit the hiring request
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          freelancerId: collaboration.userId,
          clientId: session.user.id,
          gigId: collaboration._id,
          packageType: selectedPackage || "single",
          message: contactMessage,
          status: "pending",
          price: selectedPackage
            ? collaboration[`${selectedPackage}Package`]?.price
            : collaboration.singlePrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send hiring request");
      }

      toast({
        title: "Success!",
        description: "Your hiring request has been sent to the freelancer",
      });

      setContactMessage("");
      setIsContactDialogOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error("Error hiring freelancer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send hiring request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <h2 className="text-2xl font-bold mb-4">Collaboration not found</h2>
        <Link href="/dashboard/collaboration">
          <Button>Back to Collaborations</Button>
        </Link>
      </div>
    );
  }

  // Handle field variations between API endpoints
  const title = collaboration.gigTitle || collaboration.projectTitle || "Unnamed Collaboration";
  const description = collaboration.gigDescription || collaboration.bio || "No description provided";
  const skills = collaboration.skills || (collaboration.topSkills && collaboration.topSkills.join(", ")) || "No skills specified";
  const price = collaboration.singlePrice || (typeof collaboration.salary === 'string' ? parseInt(collaboration.salary) : collaboration.salary) || 0;
  const pricingModel = collaboration.pricingModel || "single";
  const languages = collaboration.languages || (collaboration.languagesSpoken && collaboration.languagesSpoken.join(", ")) || "";

  // Check if the current user is the owner of this collaboration
  const isOwner = session?.user?.id === collaboration.userId;

  return (
    <div className="container py-8 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          Back to Collaborations
        </Button>
        <h1 className="text-3xl font-bold text-darker">{title}</h1>
        <p className="text-muted-foreground">
          By {collaboration.professionalTitle || "Professional"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Collaboration Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thumbnail Image */}
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm h-96 relative">
            {collaboration.thumbnail && !thumbnailError ? (
              <Image
                src={collaboration.thumbnail}
                alt={title}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                className="object-cover object-center"
                priority={true}
                quality={90}
                onError={() => setThumbnailError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-light to-lightest flex items-center justify-center">
                <Briefcase className="h-16 w-16 text-white" />
              </div>
            )}
          </div>

          {/* Collaboration Details */}
          <Card>
            <CardHeader>
              <CardTitle>About This Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-wrap">
                {description}
              </div>
              
              {/* Skills and Tags */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills && skills.split(",").map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-light/10 text-light px-3 py-1 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                  {!skills && (
                    <span className="text-gray-400">No skills specified</span>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {languages && languages.split(",").map((language: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {language.trim()}
                    </span>
                  ))}
                  {!languages && (
                    <span className="text-gray-400">No languages specified</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Images */}
          {collaboration.portfolioImages && collaboration.portfolioImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Samples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {collaboration.portfolioImages.map((image: string, index: number) => (
                    <div key={index} className="overflow-hidden rounded-md h-40 relative">
                      <Image
                        src={image}
                        alt={`Portfolio sample ${index + 1}`}
                        fill={true}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        quality={80}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Pricing and Contact */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Service Packages</CardTitle>
              <CardDescription>
                Select a package that meets your requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pricingModel === "single" ? (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Fixed Price Service</h3>
                    <span className="text-xl font-bold">${price}</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-light" />
                      <span>Delivery in {collaboration.deliveryTime || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-light" />
                      <span>{collaboration.revisions || 0} revisions</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="standard">Standard</TabsTrigger>
                    <TabsTrigger value="premium">Premium</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic">
                    <PackageCard
                      package={collaboration.basicPackage}
                      onSelect={() => setSelectedPackage("basic")}
                      isSelected={selectedPackage === "basic"}
                    />
                  </TabsContent>

                  <TabsContent value="standard">
                    <PackageCard
                      package={collaboration.standardPackage}
                      onSelect={() => setSelectedPackage("standard")}
                      isSelected={selectedPackage === "standard"}
                    />
                  </TabsContent>

                  <TabsContent value="premium">
                    <PackageCard
                      package={collaboration.premiumPackage}
                      onSelect={() => setSelectedPackage("premium")}
                      isSelected={selectedPackage === "premium"}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            <CardFooter>
              {!isOwner ? (
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-light hover:bg-lightest text-white hover:text-darker">
                      Hire Freelancer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Freelancer</DialogTitle>
                      <DialogDescription>
                        Send a message to discuss this collaboration
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 block">Selected Package</label>
                      <div className="p-3 border rounded-md bg-gray-50">
                        {selectedPackage ? (
                          <p className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-light mr-2" />
                            {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package - $
                            {collaboration[`${selectedPackage}Package`]?.price}
                          </p>
                        ) : (
                          <p className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-light mr-2" />
                            Fixed Price - ${collaboration.singlePrice || 0}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 block">Message</label>
                      <Textarea
                        placeholder="Describe your project requirements..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsContactDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleHire}
                        disabled={isSubmitting}
                        className="bg-light hover:bg-lightest text-white hover:text-darker"
                      >
                        {isSubmitting ? "Sending..." : "Submit Request"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  className="w-full bg-gray-200 text-gray-700 cursor-not-allowed"
                  disabled
                >
                  Your Own Collaboration
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Freelancer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About The Freelancer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{collaboration.professionalTitle || "Professional"}</h3>
                <p className="text-sm text-muted-foreground">
                  Experience Level: {collaboration.experienceLevel || collaboration.level || "Not specified"}
                </p>
              </div>
              <div className="text-sm">
                {collaboration.shortBio || description}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-light" />
                  <span>Member since {new Date(collaboration.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Package Card Component
function PackageCard({
  package: pkg,
  onSelect,
  isSelected,
}: {
  package: any;
  onSelect: () => void;
  isSelected: boolean;
}) {
  if (!pkg) {
    return (
      <div className="border rounded-lg p-4 text-center">
        <p className="text-gray-500">Package information not available</p>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 transition-all cursor-pointer ${
        isSelected ? "border-light bg-light/5" : "hover:border-light/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{pkg.name || "Package"}</h3>
        <span className="text-xl font-bold">${pkg.price || 0}</span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{pkg.description || "No description provided"}</p>
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-light" />
          <span>Delivery in {pkg.deliveryTime || "Not specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Repeat className="h-4 w-4 text-light" />
          <span>{pkg.revisions || 0} revisions</span>
        </div>
        {pkg.includes && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-light" />
            <span>{pkg.includes}</span>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={isSelected ? "bg-light text-white w-full" : "w-full"}
        >
          {isSelected ? "Selected" : "Select Package"}
        </Button>
      </div>
    </div>
  );
}