
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled ? "navbar-blur py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/images/sbcet_logo.png" 
              alt="SBCET Logo" 
              className="h-12 w-auto" 
            />
            <span className="text-xl font-display font-bold text-primary-800">
              HostelSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/#about" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/#core-features" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
              Features
            </Link>
            <Link href="/#contact-us" className="text-slate-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white bounce-transition">
                Sign In
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 right-0 p-4 animate-slideUp">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/#" 
              className="text-slate-700 hover:text-primary-600 font-medium p-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#about" 
              className="text-slate-700 hover:text-primary-600 font-medium p-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/#core-features" 
              className="text-slate-700 hover:text-primary-600 font-medium p-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#contact-us" 
              className="text-slate-700 hover:text-primary-600 font-medium p-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/auth/signin" 
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              <Button className="bg-primary-500 hover:bg-primary-600 w-full">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
