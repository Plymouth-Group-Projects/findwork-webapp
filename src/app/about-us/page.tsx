import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="pt-[60px] px-4 md:px-8 lg:px-16 bg-white text-darker">
        <div className="container mx-auto py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bebas tracking-wide mb-6">ABOUT <span className="text-lightest">FINDWORK</span></h1>
            <Separator className="w-24 h-1 bg-lightest mx-auto mb-8" />
            <p className="text-lg md:text-xl font-lato">
              Connecting talent with opportunity in the non-academic job market
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/mission.svg" 
                alt="Our Mission" 
                width={500} 
                height={400}
                className="rounded-lg mx-auto md:mx-0" 
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bebas tracking-wide mb-6">OUR MISSION</h2>
              <Separator className="w-16 h-1 bg-lightest mb-6" />
              <p className="font-lato text-lg leading-relaxed">
                FindWork connects employees, employers, freelancers, and contractors to discover opportunities, showcase talents and build 
                success with our platform. We designed this to simplify hiring and working. Our platform empowers both job seekers and 
                employers by streamlining the hiring process and creating meaningful employment connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white text-darker px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bebas tracking-wide mb-6">OUR STORY</h2>
            <Separator className="w-16 h-1 bg-lightest mx-auto mb-8" />
            <p className="font-lato text-lg leading-relaxed">
              FindWork began as a student project with a simple mission: to bridge the gap between talented individuals and employers 
              in the non-academic job market. What started as an idea has evolved into a comprehensive platform that serves both job seekers 
              and businesses looking for qualified talent.
            </p>
            <p className="font-lato text-lg leading-relaxed mt-4">
              Our founders recognized the challenges faced by both employers struggling to find reliable workers and individuals seeking 
              flexible, accessible employment opportunities. Today, FindWork has become the go-to platform for connecting skills with opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bebas tracking-wide mb-6 text-center">HOW IT WORKS</h2>
          <Separator className="w-16 h-1 bg-lightest mx-auto mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="bg-white border-none text-darker">
              <CardHeader>
                <div className="h-12 w-12 bg-lightest rounded-full flex items-center justify-center text-darker font-bold text-xl mb-2">1</div>
                <h3 className="text-xl font-semibold font-lato">Create Your Profile</h3>
              </CardHeader>
              <CardContent>
                <p className="font-lato">
                  Highlight your expertise and stand out to potential employers! Create a compelling profile showcasing your skills, experience, 
                  and achievements, increasing your chances of getting hired.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none text-darker">
              <CardHeader>
                <div className="h-12 w-12 bg-lightest rounded-full flex items-center justify-center text-darker font-bold text-xl mb-2">2</div>
                <h3 className="text-xl font-semibold font-lato">Post Jobs or Find Work</h3>
              </CardHeader>
              <CardContent>
                <p className="font-lato">
                  Businesses can post job opportunities and workers can browse available positions that match their skills and preferences. 
                  Our platform makes it easy to find the perfect match.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none text-darker">
              <CardHeader>
                <div className="h-12 w-12 bg-lightest rounded-full flex items-center justify-center text-darker font-bold text-xl mb-2">3</div>
                <h3 className="text-xl font-semibold font-lato">Connect and Thrive</h3>
              </CardHeader>
              <CardContent>
                <p className="font-lato">
                  Apply for positions, communicate with employers, and secure jobs that align with your schedule and skills—making your 
                  job search easier and more rewarding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Us */}
      <div className="bg-white text-darker py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bebas tracking-wide mb-6">CONNECT WITH US</h2>
          <Separator className="w-16 h-1 bg-lightest mx-auto mb-8" />
          <p className="font-lato text-lg max-w-2xl mx-auto mb-8">
            Have questions about FindWork? We&apos;re here to help! Contact our team for support, partnership opportunities, or feedback.
          </p>
          <p className="text-darker font-lato mb-8">
            Email Us At: <span className="text-light">findwork.codearch@gmail.com</span>
          </p>
          <Link href="/contact-us" className="inline-block">
            <Button variant="default" className="bg-light text-white hover:bg-lightest hover:text-darker">
              <span className="font-latofont-medium">CONTACT US</span>
              <ArrowRight className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
