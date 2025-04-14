"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Circle } from "lucide-react";
import { SlArrowRight } from "react-icons/sl";
import Autoplay from "embla-carousel-autoplay";
import BusinessCard from "@/components/shared/business-card";
import CarouselIndicator from "@/components/shared/carousel-indicator";

export default function TopCompanies() {
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

	const companies = [
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
		{
			id: 0,
			coverImage: "./cover-caregiver.svg",
			profileImage: "./profile-caregiver.svg",
			companyName: "iCAREGIVER",
			location: "No: 97/5, Rajagiriya, Colombo, Sri Lanka",
			category: "Personal Care",
			description:
				"iCAREGIVER is a leading home nursing service provider in Sri Lanka. We provide a range of services including Baby Care, Adult Care, and Home Nursing.",
			availableServices: ["Baby Care", "Adult Care", "Home Nursing"],
			verification: "Verified",
		},
	];
	return (
		<div>
			<div>
				<div className="container mx-auto max-w-[1400px]">
					<h2 className="text-center tracking-widest text-4xl font-semibold font-lato mt-36 mb-10">
						TOP RATED COMPANIES
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
						{companies.map((company, index) => (
							<CarouselItem
								key={index}
								className="lg:basis-[44%] sm:basis-3/5 xl:basis-[35%]"
							>
								<div className="p-1">
									<BusinessCard
										company={company}
										activeIndex={activeIndex}
										index={index}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
				<CarouselIndicator 
					api={api}
					itemCount={companies.length}
					activeIndex={activeIndex}
					onIndicatorClick={handlePaginationClick}
				/>
			</div>
		</div>
	);
}
