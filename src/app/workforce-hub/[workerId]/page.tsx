"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Star, 
  Award,
  Calendar,
  Phone,
  Mail,
  Globe,
  Briefcase,
  CreditCard,
  CheckCheck
} from "lucide-react";
import { IWorkerProfile } from "@/models/freelance-collab";
import Footer from "@/components/footer";
import { useToast, toast } from "@/hooks/use-toast";

// Add these properties to IWorkerProfile for TypeScript
interface ExtendedWorkerProfile extends IWorkerProfile {
  website?: string;
  rateType?: string;
  rating?: string | number;
}

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState<ExtendedWorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { workerId } = useParams();
  const { toasts, dismiss } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/workforce-hub/${workerId}`);
        const data = await response.json();
        
        if (data.success) {
          setProfile(data.profile);
        } else {
          console.error("Failed to fetch profile:", data.error);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [workerId]);
  
  const initiateCheckout = () => {
    if (!profile) return;
    
    setIsLoading(true);
    
    // Navigate to checkout page with workerId as query parameter
    setTimeout(() => {
      router.push(`/checkout?workerId=${workerId}`);
      setIsLoading(false);
    }, 500); // Small timeout to show the loading state for better UX
  };

  if (loading) {
    return (
      <div className="flex-grow mt-[90px] py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-grow mt-[90px] py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Worker Profile Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the worker profile you're looking for.</p>
          <Button onClick={() => window.history.back()} className="bg-light hover:bg-lightest hover:text-darker">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow mt-[90px] py-10">
        <div className="container mx-auto px-4">
          <Button 
            onClick={router.back}
            className="mb-6 bg-white text-darker hover:bg-lightest hover:bg-white/80"
          >
            &larr; Back to Search
          </Button>

          {/* Profile Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Profile Image */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden bg-white text-darker h-full">
                <div className="relative h-80 w-full">
                  <Image
                    src={profile.thumbnail || "/plumber.svg"}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-light text-white">
                      {profile.availability}
                    </Badge>
                    <Badge variant={
                      profile.level === "Expert" ? "destructive" :
                      profile.level === "Verified" ? "secondary" :
                      profile.level === "Intermediate" ? "default" :
                      "outline"
                    }>
                      {profile.level}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-gray-500 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.contact?.address || "Location not specified"}
                  </p>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg mb-2">Contact Info</h3>
                    {profile.contact?.phone && (
                      <p className="text-sm flex items-center mb-1">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.contact.phone}
                      </p>
                    )}
                    {profile.contact?.email && (
                      <p className="text-sm flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {profile.contact.email}
                      </p>
                    )}
                    {profile.website && (
                      <p className="text-sm flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <a href={profile.website} className="text-light hover:underline" target="_blank" rel="noopener noreferrer">
                          Website
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2">
              <Card className="h-full bg-white text-darker">
                <CardHeader>
                  <CardTitle>Worker Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">About</h3>
                        <p className="text-gray-600">
                          {profile.bio || "No bio information provided."}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.topSkills?.map((skill, index) => (
                            <Badge key={index} className="bg-lightest/25 text-darker border border-light hover:bg-lightest/40">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Experience</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-5 w-5 text-light" />
                          <span className="font-medium">{profile.experience?.years || 0} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCheck className="h-5 w-5 text-light" />
                          <span className="font-medium">{profile.jobsCompleted || 0} jobs completed</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Education & Certifications</h3>
                        {profile.education && profile.education.length > 0 ? (
                          <ul className="space-y-2">
                            {profile.education.map((edu, index) => (
                              <li key={index} className="bg-gray-50 p-3 rounded-md">
                                <p className="font-medium">{edu.qualification}</p>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.yearCompleted}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No education information provided.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Card className="bg-light/5 border-light/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">Pricing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-2">
                            {profile.salary || "Rate not specified"}
                          </div>
                          <div className="flex items-center mb-4 text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{profile.rateType || "Rate type not specified"}</span>
                          </div>
                          
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Service Details</h4>
                            <ul className="space-y-2 mb-6">
                              <li className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-2 text-light" />
                                <span className="text-sm">Available: {profile.availability}</span>
                              </li>
                              <li className="flex items-center">
                                <Star className="h-4 w-4 mr-2 text-light" />
                                <span className="text-sm">Rating: {profile.rating || "No ratings yet"}</span>
                              </li>
                              <li className="flex items-center">
                                <Award className="h-4 w-4 mr-2 text-light" />
                                <span className="text-sm">Experience Level: {profile.level}</span>
                              </li>
                            </ul>
                            
                            <Button
                              onClick={initiateCheckout}
                              disabled={isLoading}
                              className="w-full bg-light text-white hover:bg-lightest hover:text-darker"
                            >
                              {isLoading ? (
                                <>
                                  <span className="animate-spin mr-2">⟳</span> Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-700">Secure Booking</h4>
                            <p className="text-sm text-blue-600">
                              Your payment is secure and you'll be able to communicate with {profile.name} 
                              after booking to arrange services.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Portfolio & Projects (if any) */}
          {profile.portfolioImages && profile.portfolioImages.length > 0 && (
            <Card className="mb-6 bg-white text-darker">
              <CardHeader>
                <CardTitle>Portfolio & Previous Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profile.portfolioImages.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-md shadow-md border overflow-hidden">
                      <Image
                        src={image}
                        alt={`Portfolio item ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}