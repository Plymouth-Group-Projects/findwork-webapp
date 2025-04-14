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
  { name: "Business Hub", path: "/docs" },
  { name: "About Us", path: "/docs" },
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
        <div className="fixed inset-0 backdrop-blur-sm z-20 shadow" />
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
                {navigationItems.map((item, index) => (
                  <Link 
                    key={item.path}
                    href={item.path === "/" ? "../" : item.path}
                    className={`flex items-center px-4 py-3 hover:bg-darker/20 rounded-md transition-colors opacity-0 ${
                      pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path)) 
                        ? "bg-darker/20 font-medium" 
                        : ""
                    } animate-slide-down-delay-${index + 1}`}
                    onClick={handleNavigate}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {item.name}
                  </Link>
                ))}
                
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
