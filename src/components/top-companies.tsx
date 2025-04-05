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
import { SlArrowRight } from "react-icons/sl";

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
									<Card
										className={`
										h-[620px] bg-white border-none text-darker
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
												src={company.coverImage}
												alt={company.companyName}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												fill={true}
												className="object-cover object-center"
												priority={true}
											/>
										</CardHeader>
										<div className="absolute top-48 left-8 z-10">
												<div className="h-28 w-28 rounded-full border-2 bg-white border-white shadow-md overflow-hidden">
													<Image
														src={company.profileImage}
														alt={company.companyName}
														width={1000}
														height={1000}
														className="object-contain w-full h-full"
													/>
												</div>
											</div>
										<CardContent className="pt-14 px-8">
											<CardTitle className="font-lato">
												<span className="text-xl font-semibold uppercase">
													{company.companyName}
												</span>
												{company.verification === "Verified" && (
													<span className="text-light text-xs font-semibold ml-5 bg-lightest/20 px-3 py-[3px] rounded-xl">
														{company.verification}
													</span>
												)}
												<p className="text-xs font-normal mt-2">
													{company.location}
												</p>
											</CardTitle>
											<CardDescription>
												<p className="text-sm font-normal mt-2">
													{company.description}
												</p>
												<h2 className="text-base font-semibold mt-4">
													Our Services
												</h2>
												<ul className="grid grid-cols-3 mt-2 gap-3">
													{company.availableServices.map((skill, index) => (
														<li key={index} className="border-light border-[1px] rounded-2xl px-2 py-1 text-center text-sm bg-lightest/25">{skill}</li>
													))}
												</ul>
											</CardDescription>
											<a href="#">
												<Button
													className={`absolute bottom-5 font-medium bg-lightest hover:bg-light hover:text-white
													${activeIndex === index ? "opacity-100" : "opacity-0"}
													`}
												>
													Learn More
													<SlArrowRight className="ml-2 my-auto scale-75" size={10} />
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

						{companies.map((_, index) => (
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
