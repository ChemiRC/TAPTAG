import { Hero } from "@/components/hero/Hero";
import { Demo } from "@/components/sections/Demo";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Quote } from "@/components/sections/Quote";
import { Problem } from "@/components/sections/Problem";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Demo />
      <HowItWorks />
      <Features />
      <Quote />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
