import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TabSystem from '@/components/TabSystem';
import Team from '@/components/Team';

const page = () => {
  return (
    <div>
      <Navbar />
      {/* <Hero /> */}
      <Hero/>
      <TabSystem />
      <Features />
      <Team />
      
    </div>
  )
}

export default page