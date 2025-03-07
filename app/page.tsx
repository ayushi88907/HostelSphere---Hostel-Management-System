import Layout from "@/components/layouts/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import ContactForm from "@/components/home/ContactForm";
import FAQ from "@/components/home/FAQ";
import Auth from "@/components/Auth";
import Index from "./pages/Index";


export default function Home() {

  return ( 
    <Layout>
      <Auth/>
      {/* <Hero />
      <Features />
      <Testimonials />
      <FAQ />
      <ContactForm /> */}
      <Index/>
    </Layout>  
  );
}
