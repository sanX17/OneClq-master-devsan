import {
  MARQUEE_TAG_1,
  MARQUEE_TAG_2,
  MARQUEE_TAG_3,
  MARQUEE_TAG_4,
} from "@/lib/constant";
import { cn } from "@/lib/utils";

const MarqueeCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        className,
        "bg-black/20 text-white/90 text-md backdrop-blur-sm overflow-hidden -translate-y-2/2 lg:-translate-y-13/2 w-full relative",
      )}
    >
      <div className="flex animate-marquee">
        {/* First set of content */}
        <div className="flex items-center text-sm lg:text-lg py-2 px-5 lg:-px-0 gap-x-5 lg:gap-x-10 shrink-0 min-w-full justify-around">
          <span>♦ {MARQUEE_TAG_1}</span>
          <span>♦ {MARQUEE_TAG_2}</span>
          <span>♦ {MARQUEE_TAG_3}</span>
          <span>♦ {MARQUEE_TAG_4}</span>
        </div>
        {/* Second set of content (exact duplicate) */}
        <div className="flex items-center text-sm lg:text-lg py-2 px-5 lg:-px-0 gap-x-5 lg:gap-x-10 shrink-0 min-w-full justify-around">
          <span>♦ {MARQUEE_TAG_1}</span>
          <span>♦ {MARQUEE_TAG_2}</span>
          <span>♦ {MARQUEE_TAG_3}</span>
          <span>♦ {MARQUEE_TAG_4}</span>
        </div>
      </div>
    </div>
  );
};

export default MarqueeCard;
