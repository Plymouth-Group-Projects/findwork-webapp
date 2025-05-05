'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, UserCircle, Mail, Phone, Calendar, User, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ImageUpload from '@/components/image-upload';
import { cn } from '@/lib/utils';

// Create a simplified type for form fields to avoid TypeScript recursion issues
interface ProfileFormData {
  _id?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  image?: string;
  provider?: 'credentials' | 'google' | 'facebook';
  role?: string;
  profileViews?: number;
  lastLogin?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Helper function to format dates using the native Intl API
const formatDate = (date: Date | string | undefined, formatOptions: Intl.DateTimeFormatOptions = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}): string => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Initialize the form with profile data
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<ProfileFormData>();
  
  // Get form field values using watch (fix: use explicit field names)
  const firstName = watch('firstName', '');
  const lastName = watch('lastName', '');
  const name = firstName && lastName ? `${firstName} ${lastName}` : 'Generated from first and last name';
  
  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/auth/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        
        const profileData = await response.json();
        setProfile(profileData);
        
        // Set form values
        reset(profileData);
      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'An error occurred while fetching your profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [session, status, router, reset]);
  
  // Save profile changes
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      reset(updatedProfile);
      setSuccess('Profile updated successfully');
      
      // Refresh page data
      router.refresh();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while saving your profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle profile image upload with proper typing
  const handleImageUpload = (urls: string[]) => {
    if (urls && urls.length > 0) {
      setValue('image', urls[0]);
      setProfile(prev => prev ? { ...prev, image: urls[0] } : null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }
  
  return (
    <div className="container mt-24 mx-auto py-8 max-w-6xl">
      <div className="mb-8 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal details and account settings
            </p>
          </div>
          {profile?.role && (
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1.5">
              <Shield className="w-3.5 h-3.5 mr-1" />
              {profile.role}
            </Badge>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Picture Card */}
          <div className="col-span-1 lg:col-span-4">
            <Card className="border-white/10 shadow-md bg-white text-darker overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
                <div className="flex justify-center">
                  {profile?.image ? (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-white shadow-md -mb-14">
                      <Image 
                        src={profile.image}
                        alt="Profile Picture"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-white shadow-md -mb-14">
                      <UserCircle className="w-16 h-16 text-white/60" />
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-16 pb-6 px-6">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg">{name || 'Your Name'}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2.5 text-primary/70" />
                    <span className="font-medium">Member since:</span>
                    <span className="ml-auto text-muted-foreground">
                      {formatDate(profile?.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2.5 text-primary/70" />
                    <span className="font-medium">Last active:</span>
                    <span className="ml-auto text-muted-foreground">
                      {formatDate(profile?.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 mr-2.5 text-primary/70" />
                    <span className="font-medium">Login method:</span>
                    <span className="ml-auto text-muted-foreground capitalize">
                      {profile?.provider || 'Email'}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <p className="text-sm font-medium mb-3">Profile Picture</p>
                  <ImageUpload 
                    endpoint="imageUploader"
                    onUploadComplete={handleImageUpload}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Profile Details Tabs */}
          <div className="col-span-1 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
              <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 bg-white/60">
                <TabsTrigger 
                  value="personal" 
                  className="data-[state=active]:bg-white bg-dark data-[state=active]:text-darker data-[state=active]:shadow-sm"
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="data-[state=active]:bg-white data-[state=active]:text-darker data-[state=active]:shadow-sm"
                >
                  Contact Details
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="mt-6">
                <Card className="border-white/10 bg-white text-darker shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details here
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input 
                          id="firstName" 
                          {...register('firstName')} 
                          placeholder="First Name"
                          className="border-input/30 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input 
                          id="lastName" 
                          {...register('lastName')} 
                          placeholder="Last Name"
                          className="border-input/30 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input 
                        id="name" 
                        value={`${firstName || ''} ${lastName || ''}`.trim() || 'Generated from first and last name'}
                        disabled
                        placeholder="Full Name"
                        className="bg-muted/50 border-0 text-muted-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2.5">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                        Email Address
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register('email')} 
                        disabled 
                        placeholder="Email Address"
                        className="bg-muted/50 border-0 text-muted-foreground"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                        <Select
                          defaultValue={profile?.gender || ''}
                          onValueChange={(value) => setValue('gender', value)}
                        >
                          <SelectTrigger className="border-input/30 focus:ring-primary/30">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          type="date"
                          {...register('dateOfBirth')} 
                          placeholder="Date of Birth"
                          className="border-input/30 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contact Details Tab */}
              <TabsContent value="contact" className="mt-6">
                <Card className="border-white/10 bg-white text-darker shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">Contact Details</CardTitle>
                    <CardDescription>
                      Update your contact information
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                        Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        {...register('phone')} 
                        placeholder="Phone Number"
                        className="border-input/30 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="lastLogin" className="text-sm font-medium flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                          Last Login
                        </Label>
                        <Input 
                          id="lastLogin" 
                          value={formatDate(profile?.lastLogin, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                          disabled
                          placeholder="Last Login"
                          className="bg-muted/50 border-0 text-muted-foreground"
                        />
                      </div>
                      
                      <div className="space-y-2.5">
                        <Label htmlFor="profileViews" className="text-sm font-medium">
                          Profile Views
                        </Label>
                        <Input 
                          id="profileViews" 
                          value={profile?.profileViews?.toString() || '0'}
                          disabled
                          placeholder="Profile Views"
                          className="bg-muted/50 border-0 text-muted-foreground"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-light hover:bg-light/90 px-6"
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}