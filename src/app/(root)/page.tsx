import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { MacbookScroll } from '@/components/ui/macbook-scroll';


const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <MacbookScroll />
      
    </div>
  )
}

export default page