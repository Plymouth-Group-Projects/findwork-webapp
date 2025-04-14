"use client";

import * as React from "react";
import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 10, 90);
        return newProgress;
      });
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [progress]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-darkest z-50">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-pulse">
          <img
            src="https://axyo18gsui.ufs.sh/f/HqrudRjOwkINg6FRtEfX9XmxVlQTfdAFZ20wL6pI75MDHaNt"
            alt="logo"
            width={250}
            height={250}
            className="opacity-90"
          />
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-darker/40 rounded-full h-2.5 mb-4 overflow-hidden">
          <div 
            className="bg-light h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-center">
          <p className="text-light/80 font-lato tracking-wider text-sm">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
}
