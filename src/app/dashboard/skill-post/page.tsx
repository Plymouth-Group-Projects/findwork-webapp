"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FreelancePostForm from "@/components/freelance-post";
import { SessionProvider } from "next-auth/react";

export default function SkillPost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    if (status === "unauthenticated") {
      // Redirect to login if not authenticated
      router.push("/auth/login?callbackUrl=/dashboard/skill-post");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (isLoading && status !== "authenticated") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <SessionProvider>
        <FreelancePostForm />
      </SessionProvider>
    </div>
  );
}
