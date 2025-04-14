"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { SiAegisauthenticator } from "react-icons/si";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside the menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current && 
        !navRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-darkest/20 backdrop-blur-sm z-20 shadow" />
      )}
      <div ref={navRef} className="bg-darkest py-4 z-50 fixed w-full shadow top-0">
        <div className="container mx-auto xl:max-w-[1440px] lg:max-w-[930px]">
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="container">
                <div className="grid grid-cols-3">
                  <div className="flex items-start my-2 lg:ms-[9px] xl:ms-8 lg:scale-90 xl:scale-100 col-span-1">
                    <NavigationMenuItem>
                      <a href="../">
                        <img
                          src="https://axyo18gsui.ufs.sh/f/HqrudRjOwkINg6FRtEfX9XmxVlQTfdAFZ20wL6pI75MDHaNt"
                          alt="logo"
                          width={210}
                          height={210}
                        />
                      </a>
                    </NavigationMenuItem>
                  </div>
                  
                  <div className="flex justify-center lg:ms-10 lg:scale-95 xl:scale-100 lg:space-x-[-5px] xl:space-x-1 col-span-1">
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="../" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/job-hub" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Job Hub
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/workforce-hub" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          WorkForce Hub
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Business Hub
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          About Us
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </div>
                  
                  <div className="flex justify-end xl:me-10 lg:scale-90 xl:scale-100 col-span-1">
                    <NavigationMenuItem>
                      <Link href="/auth/login" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          <Button className="bg-light scale-90 font-lato tracking-widest text-base hover:bg-lightest hover:text-darker">
                            <SiAegisauthenticator className="me-1" />
                            LOGIN
                          </Button>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </div>
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-4">
              {/* Menu Button */}
              <Button
                className="p-2 outline-none z-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 animate-scale-up" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </Button>
              
              {/* Logo */}
              <div className="flex items-center justify-center">
                <a href="../">
                  <img
                    src="https://axyo18gsui.ufs.sh/f/HqrudRjOwkINg6FRtEfX9XmxVlQTfdAFZ20wL6pI75MDHaNt"
                    alt="logo"
                    width={170}
                    height={170}
                    className="py-1"
                  />
                </a>
              </div>
              
              {/* Empty div to maintain layout balance */}
              <div className="w-10"></div>
            </div>
            
            {/* Mobile dropdown menu */}
            {isMenuOpen && (
              <div 
                ref={menuRef} 
                className="absolute left-0 right-0 bg-darkest/95 shadow-lg backdrop-blur-sm px-5 py-4 space-y-3 mt-2 z-50 border-t border-darker/30 animate-fade-in"
              >
                <Link 
                  href="../" 
                  className="flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 animate-slide-down-delay-1"
                  onClick={handleNavigate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
                <Link 
                  href="/job-hub" 
                  className="flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 animate-slide-down-delay-2"
                  onClick={handleNavigate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  Job Hub
                </Link>
                <Link 
                  href="/workforce-hub" 
                  className="flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 animate-slide-down-delay-3"
                  onClick={handleNavigate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  WorkForce Hub
                </Link>
                <Link 
                  href="/docs" 
                  className="flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 animate-slide-down-delay-4"
                  onClick={handleNavigate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 3.617A1 1 0 014 16V4z" clipRule="evenodd" />
                  </svg>
                  Business Hub
                </Link>
                <Link 
                  href="/docs" 
                  className="flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 animate-slide-down-delay-5"
                  onClick={handleNavigate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  About Us
                </Link>
                
                {/* Login button as dropdown item */}
                <div className="border-t border-darker pt-2 my-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-4 py-2 rounded-md transition-colors opacity-0 animate-slide-down-delay-5 bg-light"
                    onClick={handleNavigate}
                  >
                    <div className="flex items-center">
                      <SiAegisauthenticator className="me-2"/>
                      <span className="tracking-widest">LOGIN</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
