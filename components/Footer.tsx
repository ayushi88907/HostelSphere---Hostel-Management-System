import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
              src="/images/sbcet_logo.png" 
              alt="SBCET Logo" 
              className="h-8 w-auto" 
            />

              <span className="text-xl font-display font-bold text-primary-800">
                HostelSphere
              </span>
            </Link>
            <p className="text-slate-600 text-sm">
              A modern hostel management system for Sri Balaji College of Engineering & Technology, Jaipur.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="#" 
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="#" 
                className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/feedback" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Feedback Form
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Emergency Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register/guide" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  How to Register
                </Link>
              </li>
              <li>
                <Link href="/password-reset" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Password Reset
                </Link>
              </li>
              <li>
                <Link href="/complaints" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Complaint Resolution
                </Link>
              </li>
              <li>
                <Link href="/outing" className="text-slate-600 hover:text-primary-600 text-sm transition-colors">
                  Outing Pass
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-600 text-sm">
                  Sri Balaji College of Engineering & Technology, Jaipur, Rajasthan
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary-500 flex-shrink-0" />
                <span className="text-slate-600 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary-500 flex-shrink-0" />
                <span className="text-slate-600 text-sm">info@sbcet.ac.in</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock size={18} className="text-primary-500 flex-shrink-0" />
                <span className="text-slate-600 text-sm">Mon-Fri: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Sri Balaji College of Engineering & Technology, Jaipur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
