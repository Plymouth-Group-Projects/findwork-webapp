"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, AlertCircle } from "lucide-react";
import CollaborationCard from "@/components/shared/collaboration-card";
import { useRouter } from "next/navigation";
import { IWorkerProfile } from "@/models/freelance-collab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CollaborationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/collaboration");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCollaborations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch collaborations:", err);
        setError("Failed to load collaborations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

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
        setCollaborations(collaborations.filter(collab => collab._id !== id));
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
    <div className="container mx-auto mt-24 px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Collaborations</h1>
        <Link href="/dashboard/collaboration/post-collab">
          <Button className="bg-light hover:bg-lightest text-white hover:text-darker flex gap-2">
            <PlusCircle size={18} />
            Create New Profile
          </Button>
        </Link>
      </div>

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
          <p className="text-muted-foreground mb-8">
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
                  imageUrl: collab.imageUrl || collab.thumbnail || "/profile-caregiver.svg",
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
    </div>
  );
}