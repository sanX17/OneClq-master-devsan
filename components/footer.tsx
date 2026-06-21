import { APPNAME, INSTAGRAM, LINKEDIN, TWITTER } from "@/lib/constant";
import Instagram from "@/public/icons/Instagram";
import LinkedIn from "@/public/icons/LinkedIn";
import X from "@/public/icons/X";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer
      className={`hidden lg:block bg-gray-50 py-16 px-4 lg:px-6 w-full`}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Company */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 min-w-12 rounded-lg flex items-center justify-center shrink-0">
                <Image
                  src="/images/oneclq-logo.png"
                  alt="OneCLQ Logo"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{APPNAME}</h3>
                {/* <p className="text-xs text-gray-600">{LOGO_TAGLINE}</p> */}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-green-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-green-600 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Socials</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href={INSTAGRAM}
                  className="hover:text-green-600 transition-colors flex items-center space-x-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link
                  href={LINKEDIN}
                  className="hover:text-green-600 transition-colors flex items-center space-x-2"
                >
                  <LinkedIn className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Link>
              </li>
              <li>
                <Link
                  href={TWITTER}
                  className="hover:text-green-600 transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>X</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-center items-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            {`${new Date().getFullYear()} ${APPNAME}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
