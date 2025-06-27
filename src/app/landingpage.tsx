import ResumeUpload from "./components/resumeupload";
import CompanyDB from "./components/companydb";
import LinkedinLogin from "./components/linkedinlogin";

import Features from "./components/frontend/Features";
import Navbar from "./components/frontend/Navbar";
import Hero from "./components/frontend/Hero";
import TabSystem from "./components/frontend/TabSystem";
import Team from "./components/frontend/Team";
import Footer from "./components/frontend/Footer";
import Cta from "./components/frontend/Cta";

export default function LandingPage() {
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
  );
}
