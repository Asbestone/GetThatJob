import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, Check } from "lucide-react";

const Cta = () => {
  return (
    <section className="pt-20 mx-8 ">
      <div className="mx-auto max-w-screen-xl rounded-2xl bg-muted/70 p-0 lg:p-16">
        <div className="flex flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 sm:gap-5 md:rounded-xl lg:flex-row lg:items-center lg:p-1">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            Ready to Land Your Dream Tech Job?
            </h3>
            <p className="text-muted-foreground lg:text-lg">
            Join thousands of successful job seekers who have improved their resumes and landed interviews at top tech companies.
            </p>
            <div className="p-2 md:w-1/2">
            <ul className="flex w-full flex-col space-y-2 text-sm font-medium sm:text-base">
              <li className="flex items-center">
                <Check className="mr-4 size-4 flex-shrink-0" />
                Lorem ipsum dolor sit.
              </li>
              <li className="flex items-center">
                <Check className="mr-4 size-4 flex-shrink-0" />
                Lorem ipsum dolor sit, amet consectetur adipisicing.
              </li>
            </ul>
          </div>
            <Button className="mt-6">
              Get Started for Free <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="shrink-0">
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white lg:min-w-72"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="mt-2 text-left text-xs text-muted-foreground">
              View our{" "}
              <a href="#" className="underline hover:text-foreground">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
