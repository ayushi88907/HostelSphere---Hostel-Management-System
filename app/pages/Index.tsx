"use client";

import { useState, useEffect } from "react";
import {
  Building,
  MessageSquare,
  MapPin,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const tourImages: string[] = [
    "tour1.png",
    "tour2.png",
    "tour3.png",
    "tour4.jpg",
  ];

  const [showMoreFeature, setShowMoreFeature] = useState(false);
  const [currentHostelImgNumber, setCurrentHostelImgNumber] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Hero Section - Updated to have image on left */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 hero-gradient overflow-hidden">
        <div className="flex items-center justify-center mb-16">
          <Badge className="bg-primary-200 rounded-full px-4 text-primary-700 border border-transparent hover:border-blue-200  hover:bg-primary-100 py-1.5">
            SBCET Hostel Management
          </Badge>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`relative transition-all duration-700 delay-300 order-2 lg:order-1 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[50px] opacity-0"
              }`}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-100 animate-float">
                <img
                  src="/images/hero_img.jpg"
                  // src="/images/948db939-2eb7-4bf3-8881-dbb52d27af80.png"
                  alt="SBCET Boys Hostel"
                  className="w-full h-full object-cover aspect-video" // Changed to aspect-video for landscape orientation
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 bg-primary-100 rounded-xl h-full w-full"></div>
            </div>

            {/* Text content moved to right */}
            <div
              className={`space-y-6 transition-all duration-700 order-1 lg:order-2 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[-50px] opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Simplify <span className="text-primary-600">Hostel Life, </span>
                One Click at a Time!
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                {/* HostelSphere simplifies hostel management with digital solutions for outings, complaints, and student management – all in one place. */}
                Say goodbye to paperwork and delays in hostel management. Get
                instant approvals, track complaints, and manage everything
                digitally. A faster, smarter, and more organized
                hostel experience!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-primary-500 hover:bg-primary-600 bounce-transition transition-all"
                  >
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>

                <Link href="/#core-features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bounce-transition transition-all text-white"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary-100 opacity-30"></div>
        <div className="absolute top-1/4 right-0 transform -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-primary-100 opacity-30"></div>
      </section>

      {/* Features Section */}
      <section id="core-features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-200 text-primary-700 rounded-full px-4 hover:bg-primary-100 border border-transparent hover:border-blue-200 py-1.5 mb-4">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Hostel Management
            </h2>
            <p className="text-slate-600">
              Our comprehensive platform offers a range of features designed to
              make hostel life simpler for students, staff, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Building}
              title="Student & Staff Management"
              description="Efficiently manage student records, room allocations, staff details, and attendance tracking in one central system."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Complaints System"
              description="Submit and track complaints related to facilities, maintenance issues, and other concerns with real-time status updates."
            />
            <FeatureCard
              icon={MapPin}
              title="Outing System"
              description="Digital outing request system allowing students to apply for and receive approval for leaves with proper tracking."
            />

            {showMoreFeature && (
              <>
                <FeatureCard
                  icon={CheckCircle}
                  title="Attendance Tracking"
                  description="Automated digital attendance system for hostel residents with reports and notifications for wardens and parents."
                />
                <FeatureCard
                  icon={BookOpen}
                  title="Study Resources"
                  description="Access to digital library, study materials, and collaborative learning spaces for academic excellence."
                />
                <FeatureCard
                  icon={Shield}
                  title="24/7 Security"
                  description="Enhanced security monitoring system with digital entry/exit logs and emergency response protocols."
                />
              </>
            )}
          </div>

          <div className="text-center mt-12">
            {/* <Link href={"/features"}>
            </Link> */}
              <Button
                variant="outline"
                onClick={() => setShowMoreFeature(!showMoreFeature)}
                className="border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-500"
              >
                {!showMoreFeature ? "View All Features" : "Minimize features"}
                <ArrowRight size={16} className="ml-2" />
              </Button>
          </div>
        </div>
      </section>

      {/* Hostel Images Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-200 rounded-full px-4 text-primary-700 hover:bg-primary-100 border border-transparent hover:border-blue-200 py-1.5 mb-4">
              Our Facilities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              SBCET Hostel Infrastructure
            </h2>
            <p className="text-slate-600">
              Modern facilities designed to provide a comfortable living
              experience while focusing on academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/boys_hostel_img.jpg"
                alt="Boys Hostel Entrance"
                className="w-full h-64 object-cover object-[20%,_20%]"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Boys Hostel - Block 1</h3>
                <p className="text-slate-600">
                  Spacious and well-maintained accommodation designed for male
                  students. Offers a comfortable living space with essential
                  amenities. A secure and peaceful environment for focused
                  studies and relaxation.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/hero_img.jpg"
                alt="Hostel Building View"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Main Hostel Building</h3>
                <p className="text-slate-600">
                  A modern multi-story building equipped with all necessary
                  facilities. Provides a well-organized and structured hostel
                  experience. Ensures a safe and comfortable stay with easy
                  access to hostel services.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/images/girls_hostel_img.jpg"
                alt="Girls Hostel"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-lg">Girls Hostel</h3>
                <p className="text-slate-600">
                  Safe and secure accommodation exclusively for female students.
                  Well-furnished rooms with essential facilities for a
                  comfortable stay. A peaceful and disciplined environment for
                  academic and personal growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="flex items-center justify-center mb-16">
          <Badge className="bg-primary-100 rounded-full px-4 text-primary-700 hover:bg-primary-200 py-1.5">
            About SBCET Hostels
          </Badge>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[280px] sm:h-[400]">
              <img
                src="/images/our_college.jpg"
                alt="Hostel exterior view"
                className="rounded-xl object-cover object-center h-full shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Modern Facilities for Educational Excellence
              </h2>
              <p className="text-slate-600">
                Sri Balaji College of Engineering & Technology offers separate
                hostels for boys and girls with modern facilities. The hostels
                feature well-maintained rooms, outdoor and indoor sports
                facilities, and a safe environment for students.
              </p>
              <p className="text-slate-600">
                Our hostels are designed to provide a comfortable living
                experience while focusing on academic excellence. The
                pollution-free environment and 24/7 security ensure that
                students can concentrate on their studies without any worries.
              </p>
              <div className="pt-2">
                <Link href="/#about">
                  <Button className="bg-primary-500 hover:bg-primary-600 hover:text-primary-100 bounce-transition transition-all">
                    Learn More About SBCET
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="bg-primary-100 rounded-full px-4 text-primary-700 hover:bg-primary-200 py-1.5 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "HostelSphere has made hostel life so much easier. The outing request system is seamless and has eliminated all the paperwork.",
                name: "Rahul Sharma",
                role: "B.Tech CSE",
              },
              {
                text: "As a hostel warden, the complaint management system has streamlined how we handle maintenance issues. Everything is now properly tracked.",
                name: "Dr. Anjali Gupta",
                role: "Hostel Warden",
              },
              {
                text: "The digital attendance system is a game-changer. Parents can now check their ward's hostel status in real-time.",
                name: "Priya Patel",
                role: "B.Tech ECE",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-700 flex-grow mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-slate-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Tour Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="bg-primary-100 rounded-full px-4 text-primary-700 hover:bg-primary-200 py-1.5 mb-4">
              Virtual Tour
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience Campus Life
            </h2>
            <p className="text-slate-600 mb-8">
              Get a glimpse of our hostel facilities and student experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 order-2 md:order-1">
              <div className="w-full h-[300px]">
                <img
                  src={`/images/${tourImages[currentHostelImgNumber]}`}
                  alt="Boys Hostel Tour"
                  className="rounded-xl object-cover h-full w-full shadow-lg mb-6"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-2xl font-bold">SBCET Hostel Experience</h3>
              <p className="text-slate-600">
                Our hostels provide a perfect balance of academic focus and
                comfortable living. Students enjoy well-maintained rooms, modern
                amenities, and a supportive community environment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Well-furnished rooms with proper ventilation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>24/7 security and support staff</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Separate blocks for boys and girls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Clean surroundings with greenery</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            {tourImages.map(
              (img, index) =>
                index !== currentHostelImgNumber && (
                  <div onClick={() => setCurrentHostelImgNumber(index)} className="shrink-0 h-32 overflow-hidden aspect-video inline-block cursor-pointer shadow rounded-lg" key={index}>
                    <img
                      src={`/images/${img}`}
                      alt="Boys Hostel Entrance Close-up"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact-us" className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Hostel Management?
            </h2>
            <p className="text-primary-50 mb-8 text-lg">
              Join HostelSphere and experience a modern approach to hostel life
              at SBCET.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 bounce-transition transition-all"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/#contact-us">
                <Button
                  size="lg"
                  variant="outline"
                  className=" bg-primary-500 hover:bg-primary-200 text-white hover:text-primary-500 bounce-transition border-transparent shadow-lg transition-all"
                  // className=" text-black border-white hover:bg-primary-700 bounce-transition transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
