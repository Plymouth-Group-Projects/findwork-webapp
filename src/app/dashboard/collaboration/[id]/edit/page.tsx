"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import FreelancePostForm from "@/components/freelance-post";
import { FormDataType } from "@/types/form-types";

export default function EditCollaboration() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [collaboration, setCollaboration] = useState<FormDataType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = params.id as string;

  useEffect(() => {
    // Check if the user is authenticated
    if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push("/auth/login?callbackUrl=/dashboard/collaboration");
    } else if (status === "authenticated" && id) {
      fetchCollaboration();
    }
  }, [status, router, id]);

  const fetchCollaboration = async () => {
    try {
      const response = await fetch(`/api/collaboration/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Format the data to match the form data structure
      const formattedData: FormDataType = {
        name: data.name,
        gender: data.gender,
        dob: data.dob,
        imageUrl: data.imageUrl,
        profileTitle: data.profileTitle,
        contact: data.contact,
        languagesSpoken: data.languagesSpoken,
        bio: data.bio,
        category: data.category,
        topSkills: data.topSkills,
        level: data.level,
        availability: data.availability,
        salary: data.salary,
        jobsCompleted: data.jobsCompleted,
        experience: data.experience,
        education: data.education,
        certifications: data.certifications,
        portfolioImages: data.portfolioImages,
        thumbnail: data.thumbnail,
        video: data.video,
        documents: data.documents,
        buyerRequirements: data.buyerRequirements,
        status: data.status
      };
      
      setCollaboration(formattedData);
    } catch (err) {
      console.error("Failed to fetch collaboration:", err);
      setError("Failed to load collaboration data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-light" />
        <span className="ml-2">Loading collaboration data...</span>
      </div>
    );
  }

  if (error || !collaboration) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500 mb-6">{error || "Collaboration not found"}</p>
        <button
          onClick={() => router.push("/dashboard/collaboration")}
          className="bg-light text-white px-4 py-2 rounded hover:bg-lightest hover:text-darker"
        >
          Go Back to Collaborations
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 px-4">Edit Collaboration Profile</h1>
      <FreelancePostForm initialData={collaboration} isEditing={true} collaborationId={id} />
    </div>
  );
}