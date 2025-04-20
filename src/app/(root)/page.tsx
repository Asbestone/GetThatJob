import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TabSystem from '@/components/TabSystem';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

const page = () => {
  return (
    <div>
      <Navbar />
      {/* <Hero /> */}
      <Hero/>
      <TabSystem />
      <Features />
      <Team />

      <Footer />
    </div>
  )
}

export default page