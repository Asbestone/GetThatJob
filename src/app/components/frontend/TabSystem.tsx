import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const TabSystem = ({
  badge = "Babbal Resume",
  heading = "Job taile pais bhai sureai ho!",
  description = "Join us to get your dream job.",
  tabs = [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Upload your Resume",
      content: {
        badge: "Onboaring✨",
        title: "Make your Resume standout.",
        description:
          "Create a stunning resume that showcases your skills and experience. Our platform helps you build a professional resume that gets noticed.",
        buttonText: "See Plans",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Let AI do its thing for you",
      content: {
        badge: "AI to your Aid ",
        title: "Boost your Resume with bla bla.",
        description:
          "Enhance your resume with AI-powered tools that help you highlight your strengths and achievements. Our platform uses advanced technology to optimize your resume.",
        buttonText: "See Tools",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Stunning Results",
      content: {
        badge: "Get Hired!",
        title: "Get noticed by employers.",
        description:
          "Our platform helps you create a resume that stands out from the competition. With our tools, you can showcase your skills and experience in a way that catches the attention of employers.",
        buttonText: "See Options",
        imageSrc:
          "https://shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "placeholder",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="pb-10 px-10">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            {heading}
          </h1> */}
          {/* <p className="text-muted-foreground">{description}</p> */}
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            <div className="relative">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="grid place-items-start gap-20 lg:grid-cols-2 lg:gap-10"
                >
                  <div className="flex flex-col gap-5">
                    <Badge variant="outline" className="w-fit bg-background">
                      {tab.content.badge}
                    </Badge>
                    <h3 className="text-3xl font-semibold lg:text-5xl">
                      {tab.content.title}
                    </h3>
                    <p className="text-muted-foreground lg:text-lg">
                      {tab.content.description}
                    </p>
                    <Button className="mt-2.5 w-fit gap-2" size="lg">
                      {tab.content.buttonText}
                    </Button>
                  </div>
                  <div className="relative h-[300px] w-full lg:h-[400px]">
                    <img
                      src={tab.content.imageSrc}
                      alt={tab.content.imageAlt}
                      className="h-full w-full rounded-xl object-cover"
                      width={600}
                      height={400}
                    />
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default TabSystem;
