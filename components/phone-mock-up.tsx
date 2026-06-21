import { APPNAME } from "@/lib/constant";
import Image from "next/image";

const PhoneMockUp = () => {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-70 lg:w-80 h-150 lg:h-162.5 bg-linear-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex items-center justify-center">
            {/* Notch */}
            <div className="w-20 h-7 bg-black rounded-full absolute top-2"></div>
            <Image
              src="/images/launching_soon.jpg"
              alt={`${APPNAME} Mobile App`}
              width={400}
              height={600}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockUp;
