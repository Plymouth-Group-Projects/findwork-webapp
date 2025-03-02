"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
	const plugin = React.useRef(
		Autoplay({ delay: 4000, stopOnInteraction: true }),
	);
	return (
		<>
			<div className="container mx-auto max-w-[380px] sm:max-w-[680px] lg:max-w-[930px] xl:max-w-[1440px] my-[60px] mt-32">
				<div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-8 gap-4 ">
					<div className="flex flex-col text-center lg:text-left items-center lg:items-start">
						<h1 className="xl:text-6xl text-5xl font-bebas tracking-wide">
							WELCOME TO <span className="text-lightest">FINDWORK</span> <br />
							YOUR GATEWAY TO OPPORTUNITIES
						</h1>
						<p className="xl:text-lg text-base tracking-wider font-lato mt-3">
							FindWork connects employees, employers, freelancers, and
							contractors to discover opportunities, showcase talents and build
							success with our platform. We designed this to simplify hiring and
							working.
						</p>
						<p className="xl:text-xl text-lg tracking-wider  font-lato mt-6 font-semibold">
							Find. Connect. and Thrive with{" "}
							<span className="text-lightest">US</span>!
						</p>
						<div className="mt-12">
							<a href="#">
								<Button className="bg-light lg:py-5 lg:px-6 text-sm xl:text-base hover:text-darker hover:bg-lightest">
									<span className="font-lato font-medium">JOIN US NOW</span>
									<ArrowRight className="ml-2 sm:scale-110" />
								</Button>
							</a>
						</div>
					</div>
					<div className=" hidden lg:block container my-[60px] xl:my-0">
						<Carousel
							plugins={[plugin.current]}
							className="w-full scale-105 gap-0"
						>
							<CarouselContent className="sm:pl-10 gap-4">
								<CarouselItem>
									<Image
										src="./carousel-photo1.svg"
										alt="Carousel Photo 1"
										width={600}
										height={600}
									/>
								</CarouselItem>
								<CarouselItem>
									<Image
										src="./carousel-photo2.svg"
										alt="Carousel Photo 2"
										width={700}
										height={700}
										className="scale-105"
									/>
								</CarouselItem>
								<CarouselItem>
									<Image
										src="./carousel-photo3.svg"
										alt="Carousel Photo 3"
										width={600}
										height={600}
									/>
								</CarouselItem>
							</CarouselContent>
						</Carousel>
					</div>
				</div>
			</div>
		</>
	);
}
