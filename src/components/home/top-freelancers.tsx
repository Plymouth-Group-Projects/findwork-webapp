"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import FreelancerCard from "@/components/shared/freelancer-card";
import CarouselIndicator from "@/components/shared/carousel-indicator";

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
									<FreelancerCard 
										freelancer={freelancer}
										isActive={activeIndex === index}
										index={index}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
				<CarouselIndicator
					api={api}
					itemCount={freelancers.length}
					activeIndex={activeIndex}
					onIndicatorClick={handlePaginationClick}
				/>
			</div>
		</div>
	);
}
