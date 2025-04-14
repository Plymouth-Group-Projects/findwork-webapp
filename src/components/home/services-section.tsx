"use client";
import React from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import CarouselIndicator from "@/components/shared/carousel-indicator";
import Autoplay from "embla-carousel-autoplay";
import { CarouselApi } from "@/components/ui/carousel";

export default function Services() {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [api, setApi] = React.useState<CarouselApi>();
	const plugin = React.useRef(
		Autoplay({ delay: 5000, stopOnInteraction: true }),
	);

	const handlePaginationClick = (index: number) => {
		if (api) {
			api.scrollTo(index);
			setActiveIndex(index);
		}
	};

	React.useEffect(() => {
		if (!api) {
			return;
		}

		api.on("select", () => {
			setActiveIndex(api.selectedScrollSnap());
		});
	}, [api]);

	const services = [
		{
			id: 0,
			title: "Post a Job",
			description:
				"Quickly create and share job postings to find the right workers with ease. Post listings, connect with qualified candidates, and hire the perfect fit—all in just a few clicks!",
			imageurl: "./job-posting.svg",
		},
		{
			id: 1,
			title: "Hire Workers",
			description:
				"Find the perfect worker for your project from a list of verified professionals. Secure payments ensure transparency and trust, making hiring seamless and worry-free through our platform.",
			imageurl: "./hire-worker.svg",
		},
		{
			id: 2,
			title: "Post Your Proficiency",
			description:
				"Highlight your expertise and stand out to potential employers! Create a compelling profile showcasing your skills, experience, and achievements, increasing your chances of getting hired for the perfect opportunity.",
			imageurl: "./post-proficiency.svg",
		},
		{
			id: 3,
			title: "Apply For Jobs",
			description:
				"Discover jobs tailored to your skills, location, and preferences. Explore listings, apply with confidence, and land opportunities that align with your schedule—making job hunting easier and more rewarding!",
			imageurl: "./apply-job.svg",
		},
	];

	return (
		<>
			<div>
				<div className="container mx-auto max-w-[1400px]">
					<h2 className="text-center tracking-widest text-4xl font-semibold font-lato mt-20 mb-10">
						TOP FEATURED SERVICES
					</h2>
				</div>
				<Carousel
					opts={{
						align: "center",
					}}
					plugins={[plugin.current]}
					className=" container mx-auto max-w-[1400px]"
					setApi={setApi}
				>
					<CarouselContent className="container">
						{services.map((service, index) => (
							<CarouselItem
								key={index}
								className="lg:basis-[44%] sm:basis-3/5 xl:basis-[35%]"
							>
								<div className="p-1">
									<Card
										className={`
                      h-[530px] bg-darkest/50 border-none
                      transition-all duration-300 ease-in-out
                      ${
												activeIndex === index
													? "scale-100 opacity-100"
													: "scale-90 opacity-50 blur-[2px]"
											}
                    `}
									>
										<CardHeader className="p-0 relative h-[250px] overflow-hidden rounded-t-lg">
											<Image
												src={service.imageurl}
												alt={service.title}
												fill={true}
												className="object-cover object-center"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												priority
											/>
										</CardHeader>
										<CardContent>
											<CardTitle className="text-xl font-semibold font-lato mt-5 mb-3">
												{service.title}
											</CardTitle>
											<CardDescription className="text-base text-justify">
												{service.description}
											</CardDescription>
											<a href="#">
												<Button
													className={`absolute bottom-5 font-medium bg-light hover:bg-lightest hover:text-darker
                              ${activeIndex === index ? "opacity-100" : "opacity-0"}
                              `}
												>
													Learn More
												</Button>
											</a>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
				<CarouselIndicator 
					api={api}
					itemCount={services.length}
					activeIndex={activeIndex}
					onIndicatorClick={handlePaginationClick}
				/>
			</div>
		</>
	);
}
