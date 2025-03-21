import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-white bg-darkest py-10 px-16">
      <div className="container mx-auto max-w-[1440px] flex flex-col md:flex-row justify-between">
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold">FINDWORK</h2>
          <p className="text-sm mt-4 leading-relaxed">
            We are dedicated to connecting non-academic job seekers with meaningful employment opportunities. Our platform simplifies the job search process, providing tailored resources and support to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="text-sm mt-4 space-y-2">
              <li>About Us</li>
              <li>Features</li>
              <li>News</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="text-sm mt-4 space-y-2">
              <li>Events</li>
              <li>Promo</li>
              <li>Reg Demo</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="text-sm mt-4 space-y-2">
              <li>Account</li>
              <li>Support Center</li>
              <li>Feedback</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 md:mt-0 md:ml-10">
          <h3 className="text-lg font-semibold">Contact Info</h3>
          <p className="text-sm mt-2">Company@gmail.com</p>
          <div className="flex space-x-4 mt-4">
            <FaFacebook className="cursor-pointer text-xl" />
            <FaTwitter className="cursor-pointer text-xl" />
            <FaInstagram className="cursor-pointer text-xl" />
            <FaLinkedin className="cursor-pointer text-xl" />
          </div>
        </div>
      </div>
    </footer>
  );
}
