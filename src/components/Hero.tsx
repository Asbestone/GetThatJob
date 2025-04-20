import { Star, ArrowDownRight } from "lucide-react";
import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Hero7Props {
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
}

const Hero7 = ({
  heading = "GetThatJob.",
  description = "Jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt Jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jptJpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jptJpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt jpt",
  buttons = {
    primary: {
      text: "Sign Up",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "Get Started",
      url: "https://www.shadcnblocks.com",
    },
  },
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
}: Hero7Props) => {
  return (
    <section className="pt-28 px-20">
      <div className="container text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-4xl font-extrabold lg:text-7xl">{heading}</h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row ">
            {buttons.primary && (
              <Button size="lg" asChild className="w-full sm:w-auto mt-10">
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
            {buttons.secondary && (
              <Button size="lg" asChild className="w-full sm:w-auto mt-10" variant="outline">
                <a href={buttons.secondary.url}>
                  {buttons.secondary.text}
                  <ArrowDownRight className="size-4" />
                </a>
              </Button>
            )}
          </div>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
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
        </div>
      </div>
    </section>
  );
};

export default Hero7;
