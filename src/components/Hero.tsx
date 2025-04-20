import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Integration {
  id: string;
  icon: React.ReactNode;
}

interface HeroProps {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
  badge?: string;
  integrations?: Integration[][];
}

const Hero = ({
  heading = "GetThatJob.",
  description = "Ipsom dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  buttons = {
    primary: {
      text: "Sign Up",
      url: "#",
    },
    secondary: {
      text: "Get Started",
      url: "#",
    },
  },
  integrations = [
    [
      {
        id: "integration-1",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-2",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/apple-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-3",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/tesla-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-4",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/meta-logo.svg"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-5",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
    ],
    [
      {
        id: "integration-6",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/openai-logo.svg"
            width={200}
            height={200}
          />
        ),
      },
      {
        id: "integration-7",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-8",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-9",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-10",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
    ],
    [
      {
        id: "integration-11",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-12",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-13",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-14",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
      {
        id: "integration-15",
        icon: (
          <Image
            alt="Integration"
            src="/company-logos/google-logo.png"
            width={100}
            height={100}
          />
        ),
      },
    ],
  ],
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
        alt: "Avatar 1",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
        alt: "Avatar 2",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
        alt: "Avatar 3",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
        alt: "Avatar 4",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
        alt: "Avatar 5",
      },
    ],
  },
  badge = "✨www.getthatjob.com🎉",
}: HeroProps) => {
  return (
    <section className="relative overflow-hidden px-10 sm:px-6 md:px-10 lg:px-20">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100 pointer-events-none select-none">
        <Image
          alt="background"
          src="https://shadcnblocks.com/images/block/patterns/square-alt-grid.svg"
          className="opacity-90 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
          width={1600}
          height={800}
        />
      </div>
      <div className="relative">
        <div className="relative container flex flex-col items-start gap-10 md:flex-row md:items-center md:-space-x-0">
          <div className="z-20 w-full shrink-0 bg-background px-2 pt-20 sm:px-4 md:w-1/2 md:bg-transparent md:pb-32">
            <div className="flex flex-col items-start text-left">
              <div className="max-w-sm w-full">
                <Badge variant="outline">{badge}</Badge>
                <h1 className="my-3 text-3xl sm:text-4xl font-bold text-pretty lg:text-6xl">
                  {heading}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
                <div className="flex flex-col justify-start gap-2 sm:flex-row ">
                  {buttons.primary && (
                    <Button size="lg" asChild className="w-full sm:w-auto mt-5">
                      <a href={buttons.primary.url}>{buttons.primary.text}</a>
                    </Button>
                  )}
                  {buttons.secondary && (
                    <Button
                      size="lg"
                      asChild
                      className="w-full sm:w-auto mt-5"
                      variant="outline"
                    >
                      <a href={buttons.secondary.url}>
                        {buttons.secondary.text}
                        <ArrowDownRight className="size-4" />
                      </a>
                    </Button>
                  )}
              </div>
            </div>
          </div>
          <div className="w-full">
                    <span className="mr-4 inline-flex items-start -space-x-4 py-5">
                      {reviews.avatars.map((avatar, index) => (
                        <Avatar key={index} className="size-14 border">
                          <AvatarImage src={avatar.src} alt={avatar.alt} />
                        </Avatar>
                      ))}
                    </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className="size-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="mr-1 font-semibold">
                        {reviews.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-left font-medium text-muted-foreground">
                      from {reviews.count}+ reviews
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>No credit card required</span>
                    <span className="mx-2">•</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Free analysis for your first resume</span>
                  </div>
                </div>
              </div>
            <div className="flex flex-col gap-16 pt-12 pb-8 md:py-32">
              {integrations.map((line, i) => (
                <div key={i} className="flex gap-x-22 odd:-translate-x-22">
                  {line.map((integration) => (
                    <div
                      key={integration.id}
                      className="size-22 rounded-xl border border-background bg-background shadow-xl"
                    >
                      <div className="h-full w-full bg-muted/20 p-4">
                        {integration.icon}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
