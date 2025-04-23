import ContactForm from '@/components/contact-form';
import React from 'react';
import Image from 'next/image';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Script from 'next/script';

const FAQ_ITEMS = [
  { 
    question: "How quickly will I receive a response?", 
    answer: "We aim to respond to all inquiries within 24-48 hours during business days."
  },
  { 
    question: "Can I schedule a call with your team?", 
    answer: "Yes! You can request a call in the form and our team will arrange a suitable time."
  },
  { 
    question: "Do you offer support on weekends?", 
    answer: "We have limited support available on weekends for urgent matters."
  },
  { 
    question: "How can I report a technical issue?", 
    answer: "Please use the form above and select &apos;Technical Support&apos; in the subject dropdown."
  }
];

export default function ContactUs() {
  return (
    <div className="min-h-screen mt-16 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-wider text-white sm:text-5xl">
            <span className="block">GET IN TOUCH</span>
            <span className="block font-medium text-3xl mt-8">We&apos;d love to hear from you</span>
          </h1>
          <p className="mt-2 text-xl max-w-2xl mx-auto">
            Have a question, feedback, or want to work together? 
            Our team is ready to assist you.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-light items-start rounded-xl shadow-xl overflow-hidden">
          {/* Contact Form Column */}
          <div className="p-8 lg:p-12">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Info Column */}
          <Card className="bg-white text-darker rounded-none border-none h-full">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 ps-2">
                {[{
                  icon: <FaEnvelope className="h-4 w-4 text-white" />,
                  title: "Email",
                  content: "findwork.codearch@gmail.com"
                }, {
                  icon: <FaPhone className="h-4 w-4 text-white" />,
                  title: "Phone",
                  content: "+94 74 153 0326"
                }, {
                  icon: <FaMapMarkerAlt className="h-4 w-4 text-white" />,
                  title: "Office",
                  content: <>
                    <p>No: 93 1/1, Galle Road, Payagala, Kalutara</p>
                    <p>Sri Lanka</p>
                  </>
                }].map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="rounded-full bg-darker p-2.5 mr-3">{info.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{info.title}</h4>
                      <p>{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-60 rounded-lg overflow-hidden border border-lightest/20 shadow-sm relative" id="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.955767775264!2d79.98445447586245!3d6.52727092311771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae23173462d9939%3A0x9c53feef5ceea4ac!2sNagahaduwa%20Rd!5e0!3m2!1sen!2slk!4v1745410301085!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="mt-12 text-darker">
                <h4 className="font-medium mb-4 text-sm">Connect with us</h4>
                <div className="flex space-x-5">
                  {[{
                    icon: <FaTwitter className="h-4 w-4" />,
                    label: "Twitter"
                  }, {
                    icon: <FaLinkedinIn className="h-4 w-4" />,
                    label: "LinkedIn"
                  }].map((social, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-darker text-white border-0 hover:bg-light h-10 w-10"
                    >
                      {social.icon}
                      <span className="sr-only">{social.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-white max-w-3xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our customer support team.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow border border-lightest">
                <h3 className="text-lg font-medium text-darker">{faq.question}</h3>
                <p className="mt-2 text-darker">{faq.answer}</p>  
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
