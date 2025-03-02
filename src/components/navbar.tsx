"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="container">
                {/* Desktop menu layout */}
                <div className="grid grid-cols-3">
                  {/* Logo */}
                  <div className="flex items-start my-2 lg:ms-[9px] xl:ms-8 lg:scale-90 xl:scale-100 col-span-1">
                    <NavigationMenuItem>
                      <a href="./">
                        <Image
                          src="./finalized-logo.svg"
                          alt="logo"
                          width={210}
                          height={210}
                        />
                      </a>
                    </NavigationMenuItem>
                  </div>
                  
                  {/* Navigation links */}
                  <div className="flex justify-center lg:ms-10 lg:scale-95 xl:scale-100 lg:space-x-[-5px] xl:space-x-1 col-span-1">
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="./" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Home
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Job Hub
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:opacity-80">
                      <Link href="/docs" legacyBehavior passHref>
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
                  
                  {/* Login button */}
                  <div className="flex justify-end xl:me-10 lg:scale-90 xl:scale-100 col-span-1">
                    <NavigationMenuItem>
                      <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          <Button className="bg-light font-lato tracking-wider text-base hover:bg-lightest hover:text-darker">
                            Login
                          </Button>
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </div>
                </div>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <div className="grid grid-cols-5 md:space-x-10">
              {/* Hamburger Menu Button */}
              <div className="flex items-start justify-start">
                <Button
                  className="p-2 scale-125 outline-none z-50"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ms-5"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </Button>
              </div>
              
              {/* Logo */}
              <div className="flex items-center justify-center col-span-3 me-4 sm:me-0">
                <div className="scale-90">
                  <a href="./">
                    <Image
                      src="./finalized-logo.svg"
                      alt="logo"
                      width={200}
                      height={200}
                    />
                  </a>
                </div>
              </div>
              
              {/* Login button */}
              <div className="flex items-end justify-end">
                <div className="flex justify-end">
                  <Link href="/docs" className={navigationMenuTriggerStyle()}>
                    <Button className="bg-light font-lato tracking-wider scale-[80%] md:scale-95 mt-1 hover:bg-lightest hover:text-darker">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Mobile dropdown menu */}
            {isMenuOpen && (
              <div 
                ref={menuRef} 
                className="absolute left-0 right-0 bg-darkest p-4 bg-opacity-80 px-5 space-y-2 mt-2 z-50"
              >
                <Link 
                  href="./" 
                  className={navigationMenuTriggerStyle()}
                  onClick={handleNavigate}
                >
                  Home
                </Link>
                <Link 
                  href="/docs" 
                  className={navigationMenuTriggerStyle()}
                  onClick={handleNavigate}
                >
                  Job Hub
                </Link>
                <Link 
                  href="/docs" 
                  className={navigationMenuTriggerStyle()}
                  onClick={handleNavigate}
                >
                  WorkForce Hub
                </Link>
                <Link 
                  href="/docs" 
                  className={navigationMenuTriggerStyle()}
                  onClick={handleNavigate}
                >
                  Business Hub
                </Link>
                <Link 
                  href="/docs" 
                  className={navigationMenuTriggerStyle()}
                  onClick={handleNavigate}
                >
                  About Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
