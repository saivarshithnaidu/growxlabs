import { Feature1 } from "@/components/ui/feature-1";

const DemoOne = () => {
  return (
    <Feature1   
      title="Blocks built with Shadcn & Tailwind"
      description="Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project."
      imageSrc="https://shadcnblocks.com/images/block/placeholder-1.svg"
      imageAlt="placeholder hero"
      buttonPrimary={{
        label: "Get Started",
        href: "https://shadcnblocks.com"
      }}
      buttonSecondary={{
        label: "Learn More",
        href: "https://shadcnblocks.com"
      }}
    />
  );
};

export { DemoOne };
