import React from "react";
import HeroSection from "../components/hero-section";
import Services from "@/components/services-section";
import Categories from "@/components/categories-section";
export default function Home() {
	return (
		<>
			<HeroSection />
			<Services />
			<Categories />
		</>
	);
}
