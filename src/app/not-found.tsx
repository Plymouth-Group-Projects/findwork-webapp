import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="flex justify-center ms-4 mb-12">
         <Image
            src="/finalized-logo.svg"
            alt="Logo"
            width={400}
            height={400}
            className="ms-4"
          />
        </div>
        
        {/* 404 heading */}
        <h1 className="text-8xl font-bold text-lightest mb-4 animate-pulse">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            asChild
            className="bg-light font-lato tracking-widest text-base hover:bg-lightest hover:text-darker"
          >
            <Link href="/">
              Go to Home
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="border hover:bg-light/10 font-lato tracking-widest text-base"
          >
            <Link href="/job-hub">
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-light/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-light/5 blur-3xl"></div>
      </div>
    </div>
  );
}
