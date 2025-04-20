import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TabSystem from '@/components/TabSystem';

const page = () => {
  return (
    <div>
      <Navbar />
      {/* <Hero /> */}
      <Hero/>
      <TabSystem />
      <Features />
      
    </div>
  )
}

export default page