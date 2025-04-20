import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Team1Props {
  heading?: string;
  subheading?: string;
  description?: string;
  members?: TeamMember[];
}

const Team = ({
  heading = "Meet our team",
  // subheading = "We're hiring",
  description = "Yo xai aile only for experimental purpose. We are not hiring anyone.Yo xai aile only for experimental purpose. We are not hiring anyone.Yo xai aile only for experimental purpose. We are not hiring anyone.",
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
}: Team1Props) => {
  return (
    <section className="mt-8">
      <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
        {/* <p className="semibold">{subheading}</p> */}
        <h2 className="text-center text-2xl font-bold text-pretty lg:text-4xl">
          {heading}
        </h2>
        <p className="mb-8 text-center text-muted-foreground lg:text-xl">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
