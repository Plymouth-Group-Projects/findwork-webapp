"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiAegisauthenticator } from "react-icons/si";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

// Navigation items array for easier management
const navigationItems = [
  { name: "Home", path: "/" },
  { name: "Job Hub", path: "/job-hub" },
  { name: "WorkForce Hub", path: "/workforce-hub" },
  { name: "Business Hub", path: "/business-hub" },
  { name: "About Us", path: "/about-us" },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // NavItem component for desktop navigation
  const NavItem = ({ path, name }: { path: string, name: string }) => {
    const isActive = pathname === path || (path !== "/" && pathname.startsWith(path));
    
    return (
      <NavigationMenuItem className="hover:opacity-80">
        <Link href={path === "/" ? "../" : path} legacyBehavior passHref>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} ${isActive ? "text-lightest font-medium" : ""}`}
          >
            {name}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    );
  };

  return (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-20 shadow md:hidden" />
      )}
      <div ref={navRef} className="bg-darkest py-4 z-50 fixed w-full shadow top-0">
        <div className="container mx-auto xl:max-w-[1440px] lg:max-w-[930px]">
          {/* Desktop Navigation - Hidden on mobile, visible on md and up */}
          <NavigationMenu className="hidden lg:block">
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
                  {navigationItems.map((item) => (
                    <NavItem key={item.path} path={item.path} name={item.name} />
                  ))}
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
          
          {/* Mobile Navigation - Visible on mobile, hidden on md and up */}
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
                className="absolute left-0 right-0 text-white bg-darkest shadow-lg backdrop-blur-sm px-5 py-4 space-y-3 mt-2 z-50 border-t border-darker/30 animate-fade-in"
              >
                {navigationItems.map((item, index) => {
                  // Custom icon for each navigation item
                  let icon;
                  switch(item.name) {
                    case "Home":
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      );
                      break;
                    case "Job Hub":
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                      );
                      break;
                    case "WorkForce Hub":
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      );
                      break;
                    case "Business Hub":
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                      );
                      break;
                    case "About Us":
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      );
                      break;
                    default:
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      );
                  }

                  return (
                    <Link 
                      key={item.path}
                      href={item.path === "/" ? "../" : item.path}
                      className={`flex items-center px-4 z-50 text-white py-3 hover:text-lightest rounded-md transition-colors animate-fade-in ${
                        pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path)) 
                          ? "text-lightest font-medium" 
                          : ""
                      }`}
                      onClick={handleNavigate}
                    >
                      {icon}
                      {item.name}
                    </Link>
                  );
                })}
                
                {/* Login button as dropdown item */}
                <div className="border-t border-darker pt-2 my-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center px-4 py-2 rounded-md transition-colors animate-fade-in bg-light"
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
