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

const getDaysLeft = (deadline: string) => {
	const today = new Date();
	const deadlineDate = new Date(deadline);
	const timeDiff = deadlineDate.getTime() - today.getTime();
	const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return daysLeft;
};

export default function LatestJobSection() {
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

	const jobOppurtunities = [
		{
			id: 0,
			imageUrl: "./electrician.svg",
			title: "Electrician",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
		{
			id: 1,
			imageUrl: "./electrician.svg",
			title: "Job Title",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
		{
			id: 2,
			imageUrl: "./electrician.svg",
			title: "Job Title",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
		{
			id: 3,
			imageUrl: "./electrician.svg",
			title: "Job Title",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
		{
			id: 4,
			imageUrl: "./electrician.svg",
			title: "Job Title",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
		{
			id: 5,
			imageUrl: "./electrician.svg",
			title: "Job Title",
			employementType: "Full Time",
			company: "DSN Constructions (Pvt) Ltd",
			location: "No: 123, Colombo Road, Colombo 07",
			description:
				"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, excepturi? Fugiat voluptatum odit minima voluptate, at perspiciatis ab tenetur enim.",
			salary: "Rs.35,000/Month",
			deadline: "2025-03-10",
			receivedApplications: "100",
		},
	];
	return (
		<div>
			<div>
				<div className="container mx-auto max-w-[1400px]">
					<h2 className="text-center tracking-widest text-4xl font-semibold font-lato mt-36 mb-10">
						LATEST JOB OPPORTUNITY
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
						{jobOppurtunities.map((opportunities, index) => (
							<CarouselItem
								key={index}
								className="lg:basis-[44%] sm:basis-3/5 xl:basis-[35%]"
							>
								<div className="p-1">
									<Card
										className={`
                      h-[400px] bg-white border-none text-darker
                      transition-all duration-300 ease-in-out grid grid-cols-6
                      ${
												activeIndex === index
													? "scale-100 opacity-100"
													: "scale-90 opacity-50 blur-[2px]"
											}
                    `}
									>
										<div className="col-span-2 rounded-s-xl relative h-full">
											<Image
												src={opportunities.imageUrl}
												alt={opportunities.title}
												sizes="100vw, 33vw"
												fill={true}
												className="object-cover object-center rounded-s-xl"
												priority={true}
											/>
										</div>
										<div className="col-span-4">
											<CardHeader>
												<CardTitle className="font-lato">
													<span className="text-xl font-semibold uppercase">
														{opportunities.title}
													</span>
													<p className="text-xs font-normal">
														{opportunities.employementType} |{" "}
														{opportunities.receivedApplications}
														<sup>+</sup> Applicants
													</p>
												</CardTitle>
											</CardHeader>
											<CardContent>
												<CardDescription>
													<p className="text-base">{opportunities.company}</p>
													<p className="text-xs ">{opportunities.location}</p>
													<p className="text-sm mt-5">
														{opportunities.description}
													</p>
													<p className="text-sm font-semibold mt-5">
														{opportunities.salary}
													</p>
													<p className="text-xs">
														{getDaysLeft(opportunities.deadline) > 0
															? `${getDaysLeft(opportunities.deadline)} days left`
															: "Deadline passed"}
													</p>
												</CardDescription>
												<a href="#">
													<Button
														className={`absolute bottom-5 font-medium bg-lightest hover:bg-light hover:text-white
                                ${activeIndex === index ? "opacity-100" : "opacity-0"}
                              `}
													>
														Apply Now
													</Button>
												</a>
											</CardContent>
										</div>
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

						{jobOppurtunities.map((_, index) => (
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
