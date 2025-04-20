import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { MacbookScroll } from '@/components/ui/macbook-scroll';
import { Hero32 } from '@/components/Section2';


const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Hero32/>
      {/* <MacbookScroll /> */}
      <Features />
      
    </div>
  )
}

export default page