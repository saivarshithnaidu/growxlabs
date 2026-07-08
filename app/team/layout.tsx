import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GrowX Labs Team Portal",
  description: "Secure access for GrowX Labs team members",
};

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#0A0A0A] text-white flex flex-col`}>
      {children}
    </div>
  );
}
