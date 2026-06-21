import { DOWNLOAD_APP } from "@/lib/constant";
import { QrCode } from "lucide-react";

const DownloadQR = () => {
  return (
    <div className="absolute bottom-8 right-5 cursor-pointer bg-white/20 border border-black/40 backdrop-blur-sm p-4 rounded-xl shadow-lg hidden lg:block hover:scale-105 transition-transform duration-300 ease-in-out">
      <QrCode className="w-16 h-16 mb-2" />
      <div className="text-center">
        <div className="font-bold text-sm">{DOWNLOAD_APP}</div>
        {/* <div className="font-bold text-sm">{APPNAME}</div> */}
      </div>
    </div>
  );
};

export default DownloadQR;
