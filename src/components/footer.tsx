import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-white bg-darkest py-10 px-4 sm:px-8 lg:px-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container mx-auto max-w-[1440px]">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* Company information */}
          <div className="max-w-sm">
            <Image
              src="/finalized-logo.svg"
              alt="FindWork Logo"
              width={250}
              height={50}
            />
            <p className="text-sm mt-4 leading-relaxed">
              We are dedicated to connecting non-academic job seekers with meaningful employment opportunities. Our platform simplifies the job search process, providing tailored resources and support to help you succeed.
            </p>
          </div>

          {/* Navigation links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10 mt-6 lg:mt-0">
            <div>
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm hover:text-lightest transition-colors">About Us</Link></li>
                <li><Link href="/features" className="text-sm hover:text-lightest transition-colors">Features</Link></li>
                <li><Link href="/news" className="text-sm hover:text-lightest transition-colors">News</Link></li>
                <li><Link href="/faq" className="text-sm hover:text-lightest transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/events" className="text-sm hover:text-lightest transition-colors">Events</Link></li>
                <li><Link href="/promo" className="text-sm hover:text-lightest transition-colors">Promo</Link></li>
                <li><Link href="/demo" className="text-sm hover:text-lightest transition-colors">Reg Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/dashboard" className="text-sm hover:text-lightest transition-colors">Account</Link></li>
                <li><Link href="/support" className="text-sm hover:text-lightest transition-colors">Support Center</Link></li>
                <li><Link href="/feedback" className="text-sm hover:text-lightest transition-colors">Feedback</Link></li>
                <li><Link href="/contact" className="text-sm hover:text-lightest transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact information */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <p className="text-sm mt-2">findwork.codearch@gmail.com</p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-xl hover:text-lightest transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-xl hover:text-lightest transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-xl hover:text-lightest transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="text-xl hover:text-lightest transition-colors" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="mt-10 pt-6 border-t border-gray-900/25">
          <p className="text-center text-sm">© {currentYear} FindWork. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
