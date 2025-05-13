"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import CollaborationCard from "@/components/shared/collaboration-card";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CollaborationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [hiredCollaborations, setHiredCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHired, setLoadingHired] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorHired, setErrorHired] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("my-collabs");  // Track counts for badges
  const [collaborationCount, setCollaborationCount] = useState<number>(0);
  const [hiredCollaborationCount, setHiredCollaborationCount] = useState<number>(0);
  const [loadingCounts, setLoadingCounts] = useState<boolean>(true);

  // Fetch initial counts for both tabs
  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingCounts(true);
      try {
        // Fetch my collaborations count
        const myCollabResponse = await fetch("/api/collaboration?countOnly=true");
        if (myCollabResponse.ok) {
          const data = await myCollabResponse.json();
          setCollaborationCount(data.count);
        }
        
        // Fetch hired collaborations count 
        const hiredCollabResponse = await fetch("/api/collaboration/hired?countOnly=true");
        if (hiredCollabResponse.ok) {
          const data = await hiredCollabResponse.json();
          setHiredCollaborationCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch collaboration counts:", err);
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCounts();
  }, []);

  // Fetch full collaboration data when needed
  useEffect(() => {
    const fetchCollaborations = async () => {
      if (activeTab !== "my-collabs") return;
      
      try {
        setLoading(true);
        const response = await fetch("/api/collaboration");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCollaborations(data);
        setCollaborationCount(data.length);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch collaborations:", err);
        setError("Failed to load collaborations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, [activeTab]);  useEffect(() => {
    const fetchHiredCollaborations = async () => {
      try {
        setLoadingHired(true);
        // Small delay to show loading state when changing tabs
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await fetch("/api/collaboration/hired");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setHiredCollaborations(data);
        setHiredCollaborationCount(data.length);
        setErrorHired(null);
      } catch (err) {
        console.error("Failed to fetch hired collaborations:", err);
        setErrorHired("Failed to load hired collaborations. Please try again later.");
      } finally {
        setLoadingHired(false);
      }
    };

    if (activeTab === "hired-collabs") {
      fetchHiredCollaborations();
    }
  }, [activeTab]);

  const handlePreview = (id: string) => {
    router.push(`/dashboard/collaboration/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/collaboration/${id}/edit`);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this collaboration profile?")) {
      try {
        const response = await fetch(`/api/collaboration/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        // Remove the deleted collaboration from state
        const updatedCollabs = collaborations.filter(collab => collab._id !== id);
        setCollaborations(updatedCollabs);
        
        // Update count in the tab badge
        setCollaborationCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to delete collaboration:", err);
        setError("Failed to delete collaboration. Please try again later.");
      }
    }
  };

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <div className="container mx-auto mt-28 px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Collaborations</h1>
        <Link href="/dashboard/collaboration/post-collab">
          <Button className="bg-light hover:bg-lightest scale-75 text-white hover:text-darker flex gap-2">
            <PlusCircle size={18} />
            Create New Profile
          </Button>
        </Link>
      </div>      
      <Tabs defaultValue="my-collabs" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full justify-start border-b rounded-md bg-white/70 shadow-sm">            
        <TabsTrigger 
            value="my-collabs" 
            className="flex-1 data-[state=active]:text-light data-[state=active]:bg-white relative"
          >
            My Collaborations
            {!loadingCounts && collaborationCount > 0 && (
              <span className="ml-2 bg-light text-white text-xs py-0.5 px-2 rounded-full">
                {collaborationCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="hired-collabs" 
            className="flex-1 data-[state=active]:text-light data-[state=active]:bg-white relative"
          >
            Hired Collaborations
            {!loadingCounts && hiredCollaborationCount > 0 && (
              <span className="ml-2 bg-light text-white text-xs py-0.5 px-2 rounded-full">
                {hiredCollaborationCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
          <TabsContent 
          value="my-collabs"
          className="mt-6 transition-all duration-300 ease-in-out"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-light" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : collaborations.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold mb-4">No collaboration profiles found</h2>
              <p className="text-white mb-8">
                Create your first collaboration profile to showcase your skills and services.
              </p>
              <Link href="/dashboard/collaboration/post-collab">
                <Button className="bg-light hover:bg-lightest text-white hover:text-darker flex gap-2">
                  <PlusCircle size={18} />
                  Create Profile
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collaborations.map((collab, index) => (
                  <CollaborationCard 
                    key={collab._id}
                    collaboration={{
                      id: collab._id,
                      imageUrl: collab.imageUrl || collab.thumbnail,
                      Name: collab.name || collab.profileTitle,
                      availability: collab.availability || "Available",
                      topSkills: collab.topSkills || [],
                      address: collab.contact?.address || "Location not specified",
                      salary: collab.salary || "Negotiable",
                      jobsCompleted: collab.jobsCompleted?.toString() || "0",
                      level: collab.level || "Intermediate"
                    }}
                    isActive={true}
                    index={index}
                    onPreview={() => handlePreview(collab._id)}
                    onEdit={() => handleEdit(collab._id)}
                    onDelete={() => handleDelete(collab._id)}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent 
          value="hired-collabs"
          className="mt-6 transition-all duration-300 ease-in-out"
        >          {loadingHired ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-light" />
            </div>
          ) : errorHired ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorHired}</AlertDescription>
            </Alert>
          ) : hiredCollaborations.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold mb-4">No hired collaborations found</h2>
              <p className="text-muted-foreground mb-8">
                You haven't hired any collaborators yet. Browse the workforce hub to find skilled professionals.
              </p>
              <Link href="/workforce-hub">
                <Button className="bg-light hover:bg-lightest text-white hover:text-darker flex gap-2">
                  Browse Workforce
                </Button>
              </Link>
            </div>
          ) : (
            <>              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hiredCollaborations.map((collab, index) => (
                  <CollaborationCard 
                    key={collab._id}
                    collaboration={{
                      id: collab._id,
                      imageUrl: collab.imageUrl || collab.thumbnail,
                      Name: collab.name || collab.profileTitle,
                      availability: collab.availability || "Available",
                      topSkills: collab.topSkills || [],
                      address: collab.contact?.address || "Location not specified",
                      salary: collab.salary || "Negotiable",
                      jobsCompleted: collab.jobsCompleted?.toString() || "0",
                      level: collab.level || "Intermediate",
                      isHiredCollaboration: true,
                      projectTitle: collab.projectTitle || collab.name || "Hired Collaboration",
                      projectDescription: collab.projectDescription || "No description available",
                      currentStatus: collab.status || "active",
                      hiredDate: collab.hiredDate || new Date().toISOString(),
                      paymentAmount: collab.paymentAmount || collab.budget || 0
                    }}
                    isActive={true}
                    index={index}
                    onPreview={() => handlePreview(collab._id)}
                    onEdit={() => {}} // Empty function for hired collaborations
                    onDelete={() => {}} // Empty function for hired collaborations
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}