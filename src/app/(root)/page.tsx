import Hero from '@/components/Hero';
import { NavbarComponent } from '@/components/Navbar';
import { MacbookScroll } from '@/components/ui/macbook-scroll';


const page = () => {
  return (
    <div>
      <NavbarComponent />
      <Hero />
      <MacbookScroll />
      
    </div>
  )
}

export default page