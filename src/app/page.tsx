import React from "react";
import HeroSection from "../components/home/hero-section";
import Services from "@/components/home/services-section";
import Categories from "@/components/home/categories-section";
import LatestJobSection from "@/components/home/latest-job-section";
import TopFreelancers from "@/components/home/top-freelancers";
import TopCompanies from "@/components/home/top-companies";
import Footer from "@/components/footer";
import ContactUs from "@/components/home/contactus-section";

export default function Home() {
	return (
		<>
			<HeroSection />
			<Services />
			<Categories />
			<LatestJobSection />
			<TopFreelancers />
			<ContactUs />
			<Footer />
		</>
	);
}
