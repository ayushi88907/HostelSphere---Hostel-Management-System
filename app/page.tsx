import Layout from "@/components/layouts/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import ContactForm from "@/components/home/ContactForm";
import FAQ from "@/components/home/FAQ";
import { getServerSession } from "next-auth";
import { nextOptions } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Auth from "@/components/Auth";
import Index from "./pages/Index";


export default async function Home() {

  const session = await getServerSession(nextOptions);

  if (session) {
    redirect("/dashboard"); 
  }

  return ( 
    <Layout>
      <Auth/>
      <Index/>
    </Layout>  
  );
}
