import React from "react";
import HeroSection from "../components/hero-section";
import Services from "@/components/services-section";
import Categories from "@/components/categories-section";
import LatestJobSection from "@/components/latest-job-section";
import TopFreelancers from "@/components/top-freelancers";
import Footer from "@/components/footer";
export default function Home() {
	return (
		<>
			<HeroSection />
			<Services />
			<Categories />
			<LatestJobSection />
			<TopFreelancers />
			<Footer/>
		</>
	);
}
