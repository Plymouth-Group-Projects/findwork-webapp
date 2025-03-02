import React from "react";
import HeroSection from "../components/hero-section";
import Services from "@/components/services-section";
import Categories from "@/components/categories-section";
import LatestJobSection from "@/components/latest-job-section";
import TopFreelancers from "@/components/top-freelancers";
export default function Home() {
	return (
		<>
			<HeroSection />
			<Services />
			<Categories />
			<LatestJobSection />
			<TopFreelancers />
		</>
	);
}
