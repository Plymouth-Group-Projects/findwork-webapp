"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

export default function NavBar() {
    const [isopen, setIsOpen] = React.useState(false)

    const handleNavigate = () => {
        setIsOpen(false)
    }

  return (
    <>
    {isopen &&(
        <div className="fixed inset-0 bg-darkest/20 backdrop-blur-sm z-20"/>
    )}
    <div className="bg-darkest py-4 z-50 relative">
        <div className="container mx-auto xl:max-w-[1440px] lg:max-w-[930px]">
            <NavigationMenu>
                <NavigationMenuList className="hidden lg:flex container" >
                    <div className="grid grid-cols-3">
                        <div className="flex items-start my-2 lg:ms-[9px] xl:ms-8 lg:scale-90 xl:scale-100 col-span-1">
                            <NavigationMenuItem>
                                <a href="./">
                                    <Image 
                                    src="/finalized-logo.svg" 
                                    alt="logo"
                                    width={210}
                                    height={210}
                                    />
                                </a>
                            </NavigationMenuItem>
                        </div>
                        <div className="flex justify-center lg:ms-10 lg:scale-95 xl:scale-100 lg:space-x-[-5px] xl:space-x-1 col-span-1">
                            <NavigationMenuItem className="hover:opacity-80">
                                <Link href="./" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Home   
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="hover:opacity-80">
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Job Hub
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="hover:opacity-80">
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        WorkForce Hub
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="hover:opacity-80">
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Business Hub
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="hover:opacity-80">
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        About Us
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </div>
                        <div className="flex justify-end xl:me-10 lg:scale-90 xl:scale-100 col-span-1">
                            <NavigationMenuItem>
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        <Button className="bg-light font-lato tracking-wider text-base hover:bg-lightest hover:text-darker">Login</Button>
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </div>
                    </div>
                </NavigationMenuList>
                <NavigationMenuList className="lg:hidden grid grid-cols-3 md:space-x-10">
                    <div className="flex items-start justify-start">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger 
                            className="lg:hidden outline-none z-50"
                            onClick={() => setIsOpen(!isopen)}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 ms-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="bg-darkest p-4 bg-opacity-80 px-5 space-y-2">
                                    <Link href="./" legacyBehavior passHref>
                                        <NavigationMenuLink 
                                        className={navigationMenuTriggerStyle()}
                                        onClick={handleNavigate}>
                                            Home
                                        </NavigationMenuLink>
                                    </Link>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink 
                                        className={navigationMenuTriggerStyle()}
                                        onClick={handleNavigate}>
                                            Job Hub
                                        </NavigationMenuLink>
                                    </Link>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink 
                                        className={navigationMenuTriggerStyle()}
                                        onClick={handleNavigate}>
                                            WorkForce Hub
                                        </NavigationMenuLink>
                                    </Link>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink 
                                        className={navigationMenuTriggerStyle()}
                                        onClick={handleNavigate}>
                                            Business Hub
                                        </NavigationMenuLink>
                                    </Link>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink 
                                        className={navigationMenuTriggerStyle()}
                                        onClick={handleNavigate}>
                                            About Us
                                        </NavigationMenuLink>
                                    </Link>
                                </div>  
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </div>
                    <div className="flex items-center justify-center">
                        <NavigationMenuItem>
                            <div className="scale-[115%] sm:scale-105">
                                <a href="./">
                                    <Image 
                                    src="/finalized-logo.svg" 
                                    alt="logo"
                                    width={200}
                                    height={200}
                                    />
                                </a>
                            </div>
                        </NavigationMenuItem>
                    </div>
                    <div className="col-span-1 items-end justify-end">
                        <NavigationMenuItem>
                            <div className="flex justify-end">
                                <Link href="/docs" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        <Button className="bg-light font-lato tracking-wider scale-[70%] md:scale-95 mt-1 hover:bg-lightest hover:text-darker">Login</Button>
                                    </NavigationMenuLink>
                                </Link>
                            </div>
                        </NavigationMenuItem>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </div> 
    </div>
    </>
  )
}
