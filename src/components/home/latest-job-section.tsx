"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import CarouselIndicator from "@/components/shared/carousel-indicator";
import Autoplay from "embla-carousel-autoplay";
import JobCard from "@/components/shared/job-card";

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
									<JobCard 
										opportunity={opportunities} 
										isActive={activeIndex === index} 
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
				<CarouselIndicator 
					api={api}
					itemCount={jobOppurtunities.length}
					activeIndex={activeIndex}
					onIndicatorClick={handlePaginationClick}
				/>
			</div>
		</div>
	);
}
