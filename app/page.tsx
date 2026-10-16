import { CdRack } from "@/components/sections/cd-rack";
import { Hero } from "@/components/sections/hero";
import { Mixtapes } from "@/components/sections/mixtapes";

export default function Home() {
  return (
    <div className="pb-16">
      <Hero />
      <CdRack />
      <Mixtapes />
    </div>
  );
}
