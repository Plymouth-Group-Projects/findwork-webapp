"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarClock, 
  Phone, 
  Mail, 
  MapPin, 
  Languages, 
  Award, 
  Book, 
  DollarSign, 
  Briefcase, 
  User,
  Edit,
  Trash,
  AlertCircle,
  CheckCircle,
  FileText,
  Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface CollaborationDetail {
  _id: string;
  profileTitle: string;
  userId: string;
  name: string;
  bio: string;
  category: string;
  level: string;
  topSkills: string[];
  languagesSpoken: string[];
  salary: string;
  portfolioImages: string[];
  thumbnail: string;
  status: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  userInfo?: {
    name: string;
    email: string;
    profilePicture?: string;
    address?: string;
  };
  // HiredCollaboration specific fields
  isHiredCollaboration?: boolean;
  clientId?: string;
  originalProfileId?: string;
  hiredDate?: string;
  projectTitle?: string;
  projectDescription?: string;
  paymentTerms?: string;
  paymentAmount?: number;
  currentStatus?: 'active' | 'completed' | 'terminated' | 'on-hold';
  stripeSessionId?: string;
  createdAt: string;
}

export default function CollaborationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [collaboration, setCollaboration] = useState<CollaborationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [owner, setOwner] = useState<any>(null);
  
  // Debug session status
  useEffect(() => {
    console.log("Session status:", sessionStatus);
    console.log("Session data:", session);
  }, [session, sessionStatus]);

  useEffect(() => {
    const fetchCollaboration = async () => {
      try {
        const response = await fetch(`/api/collaboration/${id}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch collaboration details');
        }
        
        const data = await response.json();
        setCollaboration(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the collaboration');
        console.error('Error fetching collaboration:', err);
      } finally {
        setLoading(false);
      }    };
    
    if (id) {
      fetchCollaboration();
    }
  }, [id]);
    // Check if current user is the owner or client by comparing database IDs
  useEffect(() => {
    const checkRoles = async () => {
      // Only proceed if session is authenticated and collaboration data is available
      if (sessionStatus !== "authenticated" || !session?.user?.email || !collaboration) {
        console.log("Missing required data:", { 
          sessionStatus,
          hasSession: !!session, 
          hasSessionUser: !!session?.user,
          hasSessionEmail: !!session?.user?.email,
          hasCollaboration: !!collaboration 
        });
        return;
      }
        try {
        // Fetch the current user from database to get their MongoDB ID
        const response = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
        if (response.ok) {
          const userData = await response.json();          if (userData.success && userData.data) {
            // Compare the MongoDB ID with the collaboration's userId as strings
            const isOwnerVal = userData.data._id.toString() === collaboration.userId.toString();
            setIsOwner(isOwnerVal);
            
            // Check if user is the client who hired this collaboration
            let isClientVal = false;
            if (collaboration.isHiredCollaboration && collaboration.clientId && 
                userData.data._id.toString() === collaboration.clientId.toString()) {
              isClientVal = true;
            }
            setIsClient(isClientVal);
            
            // Log full user data for debugging
            const fullName = userData.data.firstName && userData.data.lastName ? 
              `${userData.data.firstName} ${userData.data.lastName}` : 
              (userData.data.firstName || "Unknown");
              
            console.log("Role check results:", {
              userID: userData.data._id,
              userName: fullName,
              userEmail: userData.data.email,
              userImage: userData.data.image,
              collaborationUserID: collaboration.userId,
              isOwner: isOwnerVal,
              isClient: isClientVal,
              collaborationClientId: collaboration.clientId
            });
          } else {
            console.error("User data format is unexpected:", userData);
          }
        } else {
          console.error("Failed to fetch user data:", await response.text());
        }
      } catch (err) {
        console.error('Error checking user roles:', err);
      }
    };    
    checkRoles();
  }, [session?.user?.email, collaboration, sessionStatus]);  // Use the userInfo already provided in the collaboration response
  useEffect(() => {
    if (collaboration?.userInfo) {
      setOwner(collaboration.userInfo);
      console.log("Collaboration userInfo:", collaboration.userInfo);
    }
  }, [collaboration?.userInfo]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collaboration profile?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/collaboration/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete collaboration');
      }
      
      toast({
        title: "Success",
        description: "Collaboration profile deleted successfully",
        variant: "default",
      });
      
      router.push('/dashboard/collaboration');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete collaboration',
        variant: "destructive",
      });
      console.error('Error deleting collaboration:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container px-4 mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-light"></div>
        </div>
      </div>
    );
  }

  if (error || !collaboration) {
    return (
      <div className="container px-4 mx-auto py-8">
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="bg-white rounded-t-lg border-b border-light/50">
            <CardTitle className="text-darker flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="text-darker">
              {error || 'Failed to load collaboration details'}
            </p>
            <Button 
              className="mt-4 bg-light text-white hover:bg-lightest hover:text-darker"
              onClick={() => router.push('/dashboard/collaboration')}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Handle field variations between API endpoints
  const title = collaboration.isHiredCollaboration 
    ? collaboration.projectTitle || "Hired Collaboration" 
    : collaboration.profileTitle || "Unnamed Collaboration";const description = collaboration.isHiredCollaboration 
    ? collaboration.projectDescription || "No project description provided"
    : collaboration.bio || "No description provided";
    
  const skills = collaboration.topSkills?.join(", ") || "No skills specified";
  const price = collaboration.isHiredCollaboration 
    ? collaboration.paymentAmount || 0
    : parseInt(collaboration.salary) || 0;
  const languages = collaboration.languagesSpoken?.join(", ") || "";
  
  // Format the hire date if it exists
  const hireDate = collaboration.hiredDate 
    ? new Date(collaboration.hiredDate).toLocaleDateString() 
    : "N/A";

  return (
    <div className="container mt-24 px-4 mx-auto py-8">
      {/* Back button */}
      <div className="mb-4">
        <Button
          variant="outline"
          className="mb-4 bg-white text-darker hover:bg-gray-100"
          onClick={() => router.push('/dashboard/collaboration')}
        >
          &larr; Back to Collaborations
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md bg-white mb-6">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50">
              <div className="flex justify-between items-start">                <div>
                  <CardTitle className="text-2xl text-darker">{title}</CardTitle>
                  {collaboration.isHiredCollaboration ? (
                    <CardDescription className="text-darker/70">
                      Hired Collaboration • {collaboration.currentStatus 
                        ? collaboration.currentStatus.charAt(0).toUpperCase() + collaboration.currentStatus.slice(1)
                        : "Active"}
                    </CardDescription>
                  ) : (
                    <CardDescription className="text-darker/70">
                      {collaboration.category} • {collaboration.level} Level
                    </CardDescription>
                  )}
                </div>
                <Badge className={`
                  ${collaboration.isHiredCollaboration
                    ? (collaboration.currentStatus === 'active' ? 'bg-green-500' : 
                       collaboration.currentStatus === 'on-hold' ? 'bg-amber-500' : 
                       collaboration.currentStatus === 'terminated' ? 'bg-red-500' :
                       'bg-blue-500')
                    : (collaboration.status === 'active' ? 'bg-green-500' : 
                       collaboration.status === 'pending' ? 'bg-amber-500' : 'bg-red-500')} 
                  text-white
                `}>
                  {collaboration.isHiredCollaboration 
                    ? (collaboration.currentStatus 
                        ? collaboration.currentStatus.charAt(0).toUpperCase() + collaboration.currentStatus.slice(1)
                        : "Active")
                    : (collaboration.status
                        ? collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)
                        : "Active")}
                </Badge>
              </div>
            </CardHeader>

            {/* Thumbnail image - only show for regular collaborations */}
            {!collaboration.isHiredCollaboration && collaboration.thumbnail && (
              <div className="relative w-full h-64 mt-4 mb-2">
                <Image
                  src={collaboration.thumbnail}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            
            <CardContent className="pt-5">
              <h3 className="text-lg font-semibold text-darker mb-3">
                {collaboration.isHiredCollaboration ? "Project Details" : "About This Service"}
              </h3>
              <p className="text-darker mb-6">
                {description}
              </p>
              
              <Separator className="my-6" />
              
              {/* Show different content based on collaboration type */}
              {collaboration.isHiredCollaboration ? (
                <>
                  <h3 className="text-lg font-semibold text-darker mb-3">Collaboration Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-light" />
                      <div>
                        <p className="text-sm text-darker/70">Hire Date</p>
                        <p className="text-darker font-medium">{hireDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-light" />
                      <div>
                        <p className="text-sm text-darker/70">Payment Terms</p>
                        <p className="text-darker font-medium">{collaboration.paymentTerms || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-darker mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {collaboration.topSkills?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-light/10 text-darker">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              
              <Separator className="my-6" />
                {/* Portfolio images - only show for regular collaborations */}
              {!collaboration.isHiredCollaboration && collaboration.portfolioImages && collaboration.portfolioImages.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-darker mb-3">Portfolio</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {collaboration.portfolioImages.map((image, index) => (
                      <div key={index} className="relative h-32 rounded overflow-hidden">
                        <Image
                          src={image}
                          alt={`Portfolio item ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                </>
              )}
              {(isOwner && !collaboration.isHiredCollaboration) && (
                <div className="flex flex-wrap gap-4 justify-end">
                    <Button 
                      variant="outline"
                      className="border-light text-light hover:bg-light hover:text-white"
                      onClick={() => router.push(`/dashboard/collaboration/edit/${collaboration._id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  
                  {/* Delete button */}
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Profile'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Price card */}
          <Card className="border-0 shadow-md bg-white mb-6">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50">
              <CardTitle className="text-darker flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-light" />
                {collaboration.isHiredCollaboration ? "Payment Details" : "Pricing"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="text-3xl font-bold text-darker mb-2">
                ${price} 
                <span className="text-sm font-normal text-darker/70">
                  {collaboration.isHiredCollaboration ? "" : " per project"}
                </span>
              </div>
              
              {/* Only show the hire button for regular collaborations */}
              {!collaboration.isHiredCollaboration && (
                <Button 
                  className="mt-4 w-full bg-light text-white hover:bg-lightest hover:text-darker"
                  onClick={() => router.push(`/checkout?profileId=${collaboration._id}`)}
                >
                  Hire Now
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* User info card */}
          <Card className="border-0 shadow-md bg-white mb-6">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50">
              <CardTitle className="text-darker flex items-center">
                <User className="h-5 w-5 mr-2 text-light" />
                {collaboration.isHiredCollaboration ? "Collaborator Information" : "About the Professional"}
              </CardTitle>            
            </CardHeader>            
            <CardContent className="pt-5">              
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  {owner?.profilePicture ? (
                    <AvatarImage 
                      src={owner.profilePicture} 
                      alt={owner.name} 
                    />
                  ) : (
                    <AvatarFallback>
                      {(owner?.name?.charAt(0) || 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium text-darker">{owner?.name || 'User'}</h3>
                  <p className="text-sm text-darker/70">{owner?.email}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {collaboration.languagesSpoken && collaboration.languagesSpoken.length > 0 && (
                  <div className="flex items-start">
                    <Languages className="h-5 w-5 mr-3 text-light flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-darker/70">Languages</p>
                      <p className="text-darker">{languages}</p>
                    </div>
                  </div>
                )}
                
                {collaboration.contact?.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 text-light flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-darker/70">Email</p>
                      <p className="text-darker">{collaboration.contact.email}</p>
                    </div>
                  </div>
                )}
                
                {collaboration.contact?.phone && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-light flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-darker/70">Phone</p>
                      <p className="text-darker">{collaboration.contact.phone}</p>
                    </div>
                  </div>
                )}
                
                {collaboration.contact?.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-light flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-darker/70">Address</p>
                      <p className="text-darker">{collaboration.contact.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}