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
  CheckCircle
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
  createdAt: string;
}

export default function CollaborationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [collaboration, setCollaboration] = useState<CollaborationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

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
      }
    };

    if (id) {
      fetchCollaboration();
    }
  }, [id]);

  // Check if current user is the owner by comparing database IDs
  useEffect(() => {
    const checkOwnership = async () => {
      if (!session?.user?.email || !collaboration) return;
      
      try {
        // Fetch the current user from database to get their MongoDB ID
        const response = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
        
        if (response.ok) {
          const userData = await response.json();
          // Compare the MongoDB ID with the collaboration's userId
          setIsOwner(userData._id === collaboration.userId);
        }
      } catch (err) {
        console.error('Error checking ownership:', err);
      }
    };
    
    checkOwnership();
  }, [session?.user?.email, collaboration]);

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
  const title = collaboration.profileTitle || "Unnamed Collaboration";
  const description = collaboration.bio || "No description provided";
  const skills = collaboration.topSkills?.join(", ") || "No skills specified";
  const price = parseInt(collaboration.salary) || 0;
  const languages = collaboration.languagesSpoken?.join(", ") || "";

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
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-darker">{title}</CardTitle>
                  <CardDescription className="text-darker/70">
                    {collaboration.category} • {collaboration.level} Level
                  </CardDescription>
                </div>
                <Badge className={`
                  ${collaboration.status === 'active' ? 'bg-green-500' : 
                    collaboration.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'} 
                  text-white
                `}>
                  {collaboration.status.charAt(0).toUpperCase() + collaboration.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            {/* Thumbnail image */}
            {collaboration.thumbnail && (
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
              <h3 className="text-lg font-semibold text-darker mb-3">About This Service</h3>
              <p className="text-darker mb-6">
                {description}
              </p>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold text-darker mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {collaboration.topSkills?.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-light/10 text-darker">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              {/* Portfolio images */}
              {collaboration.portfolioImages && collaboration.portfolioImages.length > 0 && (
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
              
              {/* Actions for owner */}
              {isOwner && (
                <div className="flex flex-wrap gap-4 justify-end">
                  <Button 
                    variant="outline"
                    className="border-light text-light hover:bg-light hover:text-white"
                    onClick={() => router.push(`/dashboard/collaboration/edit/${collaboration._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  
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
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="text-3xl font-bold text-darker mb-2">
                ${price} 
                <span className="text-sm font-normal text-darker/70"> per project</span>
              </div>
              
              <Button 
                className="w-full mt-4 bg-light text-white hover:bg-lightest hover:text-darker"
                disabled={!isOwner}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isOwner ? 'You own this profile' : 'Contact Provider'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Provider info */}
          <Card className="border-0 shadow-md bg-white mb-6">
            <CardHeader className="bg-white rounded-t-lg border-b border-light/50">
              <CardTitle className="text-darker flex items-center">
                <User className="h-5 w-5 mr-2 text-light" />
                Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={collaboration.userInfo?.profilePicture || ""} alt={collaboration.userInfo?.name || "User"} />
                  <AvatarFallback className="bg-light text-white">
                    {collaboration.userInfo && collaboration.userInfo.name ? 
                      collaboration.userInfo.name.split(' ').map(n => n[0]).join('') : 
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-darker">{collaboration.userInfo?.name || "Anonymous"}</h3>
                  <p className="text-sm text-darker/70">{collaboration.userInfo?.email || "No email provided"}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {collaboration.contact?.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-light" />
                    <span className="text-darker">{collaboration.contact.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-light" />
                  <span className="text-darker">{collaboration.userInfo?.email || "No email provided"}</span>
                </div>
                
                {(collaboration.userInfo?.address || collaboration.contact?.address) && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-light" />
                    <span className="text-darker">
                      {collaboration.userInfo?.address || collaboration.contact?.address}
                    </span>
                  </div>
                )}
                
                {languages && (
                  <div className="flex items-center text-sm">
                    <Languages className="h-4 w-4 mr-2 text-light" />
                    <span className="text-darker">{languages}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-2 text-light" />
                  <span className="text-darker">{collaboration.level} Experience Level</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <CalendarClock className="h-4 w-4 mr-2 text-light" />
                  <span className="text-darker">
                    Joined {new Date(collaboration.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}