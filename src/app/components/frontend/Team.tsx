import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TeamProps {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const Team = ({
  heading = "Meet our team",
  // subheading = "We're hiring",
  description = "Yo xai aile only for experimental purpose. We are not hiring anyone. Yo xai aile only for experimental purpose. We are not hiring anyone. Yo xai aile only for experimental purpose. We are not hiring anyone.",
  members = [
    {
      id: "person-1",
      name: "Bibhav Adhikari",
      role: "God",
      avatar: "https://shadcnblocks.com/images/block/avatar-2.webp",
    },
    {
      id: "person-2",
      name: "Arjav Lamsal",
      role: "Chillguy",
      avatar: "https://shadcnblocks.com/images/block/avatar-4.webp",
    },
    {
      id: "person-3",
      name: "Vision Panta",
      role: "Billionaire",
      avatar: "https://shadcnblocks.com/images/block/avatar-5.webp",
    },
  ],
}: TeamProps) => {
  return (
    <section className="mt-8 mx-10">
      <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
        {/* <p className="semibold">{subheading}</p> */}
        <h2 className="text-center text-2xl font-bold text-pretty lg:text-4xl mb-2">
          {heading}
        </h2>
        <p className="mb-5 text-center text-muted-foreground lg:text-xl">
          {description}
        </p>
        <div className="container mt-0 grid gap-x-8 gap-y-16 md:grid-cols-3 lg:grid-cols-3">
          {members.map((person) => (
            <div key={person.id} className="flex flex-col items-center">
              <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
                <AvatarImage src={person.avatar} />
                <AvatarFallback>{person.name}</AvatarFallback>
              </Avatar>
              <p className="text-center font-medium">{person.name}</p>
              <p className="text-center text-muted-foreground">{person.role}</p>
              <div className="mt-2 flex gap-4">
              <a href="#">
                <FaGithub className="size-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#">
                <FaLinkedin className="size-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
