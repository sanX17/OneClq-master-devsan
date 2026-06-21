"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  APPSTORE,
  DOWNLOAD_APP,
  PLAYSTORE,
  SIGNUP_TAGLINE,
  TAGLINE,
} from "@/lib/constant";
import HeroPhoneComponent from "./hero-phone-component";

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-green-100 via-purple-100 to-purple-200 rounded-4xl pb-10 mx-5 lg:mx-20"
      ref={ref}
    >
      <motion.div
        className="rounded-4xl mt-4 mx-auto relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* grid background */}
        <motion.div
          className="absolute inset-0 opacity-5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(90deg, white 1px, transparent 1px)
              `,
              backgroundSize: "100px 50px",
            }}
          ></div>
        </motion.div>

        {/* floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative px-4 lg:px-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
            {/* LEFT TEXT */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                className="flex lg:inline-flex items-center justify-center backdrop-blur-xl bg-white border border-white/25 rounded-xl sm:px-4 py-2 text-white shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xs sm:text-sm font-medium text-black drop-shadow-sm">
                  {SIGNUP_TAGLINE}
                </span>
                <Link href={PLAYSTORE}>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs lg:text-md transition-all duration-200 bg-black shadow-md text-white hover:text-blue-200 ml-2"
                  >
                    {DOWNLOAD_APP}
                  </Button>
                </Link>
              </motion.div>

              {/* Heading */}
              <motion.h1
                className="text-3xl lg:text-5xl text-center lg:text-left font-bold leading-tight text-balance"
                style={
                  {
                    // color: "#ffffff",
                    // textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }
                }
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.span
                  className="text-black"
                  style={
                    {
                      // textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      // WebkitBackgroundClip: "text",
                      // WebkitTextFillColor: "#000000",
                    }
                  }
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  Stop{" "}
                  <span className="bg-linear-to-r from-[#494FFF] via-[#3F73FE] to-[#000EFF] bg-clip-text text-transparent">
                    Screenshoting.
                  </span>{" "}
                  Start{" "}
                  <span className="bg-linear-to-r from-[#494FFF] via-[#3F73FE] to-[#000EFF] bg-clip-text text-transparent">
                    saving.
                  </span>
                </motion.span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                className="text-lg lg:text-2xl text-center lg:text-left max-w-xl text-pretty sm:mb-20"
                style={{
                  color: "#000000",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                Explore
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              >
                <Link href="/products">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Button
                      asChild
                      className="px-6 py-3 flex items-center h-14 shadow-lg bg-purple-600 border border-white/10 transition-all duration-200 min-w-50"
                    >
                      <div className="flex items-center justify-center gap-3 py-4">
                        {/* <Image
                          src="/images/apple.png"
                          alt="App Store"
                          width={20}
                          height={20}
                          className="invert"
                        /> */}
                        <div className="flex flex-col text-center items-center justify-center">
                          <div className="text-xs">Check out</div>
                          <div className="font-semibold text-lg">Product</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/wardrobe">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <Button
                      asChild
                      className="px-6 py-3 flex items-center h-14 shadow-lg bg-blue-500 border border-white/10 transition-all duration-200 min-w-50"
                    >
                      <div className="flex items-center justify-center gap-3 py-4">
                        {/* <Image
                          src="/images/google-play.png"
                          alt="Google play"
                          width={20}
                          height={20}
                        /> */}
                        <div className="flex flex-col text-center items-center justify-center">
                          <div className="text-xs">Check out</div>
                          <div className="font-semibold text-lg">Wardrobe</div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* RIGHT PHONE */}
            {/* <HeroPhoneComponent /> */}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
