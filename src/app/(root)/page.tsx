import Features from '@/components/Features';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

const page = () => {
  return (
    <div>
      <Navbar />
      {/* <Hero /> */}
      <Hero/>
      <Features />
      
    </div>
  )
}

export default page