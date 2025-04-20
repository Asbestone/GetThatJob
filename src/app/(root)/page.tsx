import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TabSystem from '@/components/TabSystem';
import Team from '@/components/Team';
import Footer from '@/components/Footer';
import Cta from '@/components/Cta';
// import { TestimonialCard } from '@/components/Testimonial';

const page = () => {
  return (
    <div>
      <Navbar />
      {/* <Hero /> */}
      <Hero/>
      <TabSystem />
      <Features />
      {/* <TestimonialCard /> */}
      <Team />

      <Cta />
      <Footer />
    </div>
  )
}

export default page