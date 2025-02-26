"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { CarouselApi } from "@/components/ui/carousel";
import { Circle } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Categories() {
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

	const categories = [
		{
			id: 0,
			avaterurl: "./homeAvater.svg",
			title: "Home Maintenance",
			subhead: "22 Jobs Available",
			listItems: [
				"Cleaning & Household Assistance",
				" Plumbing & Water Systems",
				" Electrical & Wiring Services",
				"Carpentry & Furniture Work",
				"Painting & Wall Finishing",
				"Appliance Repair & Installation",
			],
		},
		{
			id: 1,
			avaterurl: "./personalAvater.svg",
			title: "Personal Care",
			subhead: "18 Jobs Available",
			listItems: [
				"Babysitter",
				"Daycare Assistant",
				"Elderly Care",
				"Home Health Aide",
				"Compainion Care Assistant",
				"Patient Care Assistant",
			],
		},
		{
			id: 2,
			avaterurl: "./constructionAvater.svg",
			title: "Constructions and Renovations",
			subhead: "12 Jobs Available",
			listItems: [
				"Masonry & Building Construction",
				"Carpentry & Woodwork",
				"Plumbing & Water Systems",
				"Electrical & Wiring Work ",
				"Painting & Finishing",
				"General Construction Labor",
			],
		},
		{
			id: 3,
			avaterurl: "./transportAvater.svg",
			title: "Transport and Security",
			subhead: "33 Jobs Available",
			listItems: [
				"Security Guards",
				"Drivers",
				"CCTV Operators",
				"Bodyguards",
				"Security Alarm Installers",
			],
		},
	];
	return (
		<>
			<div>
				<div>
					<div className="container mx-auto max-w-[1400px]">
						<h2 className="text-center tracking-widest text-4xl font-semibold font-lato mt-36 mb-10">
							FEATURED CATEGORIES
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
							{categories.map((category, index) => (
								<CarouselItem
									key={index}
									className="lg:basis-[44%] sm:basis-3/5 xl:basis-[35%]"
								>
									<div className="p-1">
										<Card
											className={`
                                                h-[380px] bg-white border-none text-darker
                                                transition-all duration-300 ease-in-out
                                                ${
																									activeIndex === index
																										? "scale-100 opacity-100"
																										: "scale-90 opacity-50 blur-[2px]"
																								}
                                            `}
										>
											<CardHeader>
												<div className="grid grid-cols-5 justify-center items-center">
													<Avatar className=" bg-lightest p-2 rounded-full scale-110 ms-2">
														<AvatarImage
															src={category.avaterurl}
															alt={category.title}
														/>
													</Avatar>
													<CardTitle className="text-xl col-span-4 font-semibold font-lato">
														{category.title}
													</CardTitle>
												</div>
											</CardHeader>
											<CardContent className="ms-4">
												<CardDescription className="text-base">
													<h2 className="text-base font-semibold">
														{category.subhead}
													</h2>
													<ul className="list-disc list-inside mt-4">
														{category.listItems.map((item, index) => (
															<li key={index}>{item}</li>
														))}
													</ul>
												</CardDescription>
												<a href="#">
													<Button
														className={`absolute bottom-5 px-8 font-medium bg-lightest hover:bg-light hover:text-white
                                                                ${activeIndex === index ? "opacity-100" : "opacity-0"}
                                                            `}
													>
														View More
													</Button>
												</a>
											</CardContent>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
					<Pagination className="flex justify-center mt-5 mb-10">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => api?.scrollPrev()}
									className="cursor-pointer hover:text-lightest"
								/>
							</PaginationItem>

							{categories.map((_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										onClick={() => handlePaginationClick(index)}
										isActive={activeIndex === index}
										className="cursor-pointer border-none"
									>
										<Circle
											className={`scale-75 ${activeIndex == index ? "fill-white" : ""}`}
										/>
									</PaginationLink>
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									onClick={() => api?.scrollNext()}
									className="cursor-pointer hover:text-lightest"
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</>
	);
}
