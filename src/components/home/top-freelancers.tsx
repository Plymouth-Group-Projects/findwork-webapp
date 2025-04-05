"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
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
import { Circle } from "lucide-react";

export default function TopFreelancers() {
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

	const freelancers = [
		{
			id: 0,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
		{
			id: 1,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Beginner",
		},
		{
			id: 2,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
		{
			id: 3,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Expert",
		},
		{
			id: 4,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Verified",
		},
		{
			id: 5,
			imageUrl: "./plumber.svg",
			Name: "Rayan Fernando",
			availability: "Full Time",
			topSkills: ["Plumbing", "Electrical", "Painting"],
			address: "No: 123, Colombo Road, Colombo 07",
			salary: "Rs.4000/Day",
			jobsCompleted: "20",
			level: "Intermediate",
		},
	];
	return (
		<div>
			<div>
				<div className="container mx-auto max-w-[1400px]">
					<h2 className="text-center tracking-widest text-4xl font-semibold font-lato mt-36 mb-10">
						TOP RATED FREELANCERS
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
						{freelancers.map((freelancer, index) => (
							<CarouselItem
								key={index}
								className="lg:basis-[44%] sm:basis-3/5 xl:basis-[28%]"
							>
								<div className="p-1">
									<Card
										className={`
										h-[500px] bg-white border-none text-darker
										transition-all duration-300 ease-in-out
										${
											activeIndex === index
												? "scale-100 opacity-100"
												: "scale-90 opacity-50 blur-[2px]"
										}
                   					 `}
									>
										<CardHeader className="p-0 relative h-[250px] overflow-hidden rounded-t-lg mb-3">
											<Image
												src={freelancer.imageUrl}
												alt={freelancer.Name}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												fill={true}
												className="object-cover object-center"
												priority={true}
											/>
										</CardHeader>
										<CardContent>
											<CardTitle className="font-lato">
												<span className="text-xl font-semibold uppercase">
													{freelancer.Name}
												</span>
												<span className="text-sm absolute right-0 top-3 bg-lightest pe-5 ps-3 py-0.5 rounded-s-md">
													{freelancer.availability}
												</span>
												<span
													className={`text-xs rounded-lg font-base px-3 py-[3px] absolute right-3 mt-1 tracking-wide  
														${
															freelancer.level === "Intermediate"
																? "bg-lightest text-white"
																: freelancer.level === "Beginner"
																	? "bg-slate-300"
																	: freelancer.level === "Expert"
																		? "bg-darker text-white"
																		: freelancer.level === "Verified"
																			? "bg-darkest px-5 py-1 text-yellow-400 outline outline-1"
																			: ""
														}`}
												>
													{freelancer.level}
												</span>
												<p className="text-xs font-normal">
													{freelancer.address}
												</p>
											</CardTitle>
											<CardDescription>
												<h2 className="text-base font-semibold mt-3">
													Top Skills
												</h2>
												<ul className="grid grid-cols-3 mt-1 ms-1">
													{freelancer.topSkills.map((skill, index) => (
														<li key={index}>{skill}</li>
													))}
												</ul>
												<p className="text-sm font-semibold mt-4">
													{freelancer.salary}
												</p>
												<p className="text-xs">
													{freelancer.jobsCompleted} Jobs Completed.
												</p>
											</CardDescription>
											<a href="#">
												<Button
													className={`absolute bottom-5 font-medium bg-lightest hover:bg-light hover:text-white
													${activeIndex === index ? "opacity-100" : "opacity-0"}
													`}
												>
													Hire Now
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

						{freelancers.map((_, index) => (
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
	);
}
