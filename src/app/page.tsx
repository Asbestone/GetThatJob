import ResumeUpload from "./components/resumeupload";
import CompanyDB from "./components/companydb";
import LinkedinLogin from "./components/linkedinlogin";

export default function Home() {
  return (
    <div className="w-full h-screen bg-white">
      <LinkedinLogin />
    </div>
  );
}
