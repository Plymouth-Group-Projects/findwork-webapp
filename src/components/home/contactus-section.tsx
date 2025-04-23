import React from 'react'
import ContactForm from '../contact-form'
import { Mail, Phone } from "lucide-react";

export default function ContactUs() {
  return (
    <div className='container mx-auto px-6 py-12 md:pt-20'>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Contact Us</h2>
          <p className="max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <ContactForm />
        <div className="text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm">Email Us</p>
              <p className="font-medium">findwork.codearch@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm ">Call Us</p>
              <p className="font-medium">+94 74 153 0326</p>
            </div>
            <div className="px-6 sm:hidden"/>
          </div>
        </div>
      </div>
    </div>
  )
}
