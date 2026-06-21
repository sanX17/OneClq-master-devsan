"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BrandCard {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  size: number;
  mobileSize: number;
  delay: number;
}

const brandCards: BrandCard[] = [
  {
    id: "amazon",
    name: "Amazon",
    image: "/images/anim2/amazon.png",
    position: { x: -350, y: -200 },
    mobilePosition: { x: -150, y: -120 },
    size: 100,
    mobileSize: 65,
    delay: 0.3,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    image: "/images/anim2/flipkart.png",
    position: { x: 280, y: -200 },
    mobilePosition: { x: 100, y: -20 },
    size: 85,
    mobileSize: 60,
    delay: 0.5,
  },
  {
    id: "purplle",
    name: "Purplle",
    image: "/images/anim2/purplle.png",
    position: { x: 320, y: -60 },
    mobilePosition: { x: 100, y: -120 },
    size: 60,
    mobileSize: 60,
    delay: 0.4,
  },
  {
    id: "myntra",
    name: "Myntra",
    image: "/images/anim2/myntra.png",
    position: { x: -400, y: -50 },
    mobilePosition: { x: -150, y: -5 },
    size: 70,
    mobileSize: 50,
    delay: 0.4,
  },
  {
    id: "irctc",
    name: "IRCTC",
    image: "/images/anim2/irctc.png",
    position: { x: -400, y: 120 },
    mobilePosition: { x: -150, y: 100 },
    size: 90,
    mobileSize: 70,
    delay: 0.4,
  },
  {
    id: "ajio",
    name: "AJIO",
    image: "/images/anim2/ajio.png",
    position: { x: 320, y: 80 },
    mobilePosition: { x: 80, y: 100 },
    size: 100,
    mobileSize: 75,
    delay: 0.6,
  },
  {
    id: "jio",
    name: "Jio",
    image: "/images/anim2/jio.png",
    position: { x: -200, y: -300 },
    mobilePosition: { x: -120, y: -200 },
    size: 70,
    mobileSize: 50,
    delay: 0.6,
  },
  {
    id: "airtel",
    name: "Airtel",
    image: "/images/anim2/airtel.png",
    position: { x: 150, y: -320 },
    mobilePosition: { x: 60, y: -210 },
    size: 75,
    mobileSize: 55,
    delay: 0.8,
  },
  {
    id: "nykaa",
    name: "Nykaa",
    image: "/images/anim2/nykaa.png",
    position: { x: -50, y: -340 },
    mobilePosition: { x: -40, y: -220 },
    size: 100,
    mobileSize: 80,
    delay: 0.8,
  },
  {
    id: "book-my-show",
    name: "BookMyShow",
    image: "/images/anim2/book-my-show.png",
    position: { x: -280, y: 250 },
    mobilePosition: { x: -100, y: 220 },
    size: 90,
    mobileSize: 70,
    delay: 0.5,
  },
  {
    id: "red-bus",
    name: "RedBus",
    image: "/images/anim2/red-bus.png",
    position: { x: 200, y: 220 },
    mobilePosition: { x: 50, y: 220 },
    size: 70,
    mobileSize: 50,
    delay: 0.7,
  },
];

export default function AnimatedAppsShowcase() {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate random particles only on client
  useEffect(() => {
    const positions = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 5 + Math.random() * 3,
    }));
    setParticles(positions);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-100 via-purple-100 to-purple-200 pt-20 pb-30 mx-5 mt-10 sm:mt-20 lg:mx-20 rounded-4xl">
      {/* Main container */}
      <div className="relative flex items-center justify-center">
        {/* Central Phone - Added animation from bottom */}
        <motion.div
          className="relative z-20"
          initial={{
            y: 300, // Start from bottom
            rotateY: -30,
          }}
          whileInView={{
            y: 0, // Return to top
          }}
          transition={{
            duration: 0.5,
          }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-green-400/30 via-purple-400/20 to-transparent blur-xl" />
          <div className="relative w-[150px] h-[280px] sm:w-[280px] sm:h-[500px] mt-20">
            <Image
              src="/images/anim2/phone.png"
              alt="Phone"
              fill
              className="object-fill drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Floating brand cards - Enhanced animation to start from behind phone with scale 0 */}
        {brandCards.map((card) => (
          <motion.div
            key={card.id}
            className="absolute z-10"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{
              scale: 0,
              x: 0,
              y: 0,
              z: -100, // Start behind the phone
              opacity: 0,
            }}
            whileInView={
              isVisible
                ? {
                    scale: 1,
                    x: isMobile ? card.mobilePosition.x : card.position.x,
                    y: isMobile ? card.mobilePosition.y : card.position.y,
                    z: 0,
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              delay: card.delay,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              animate={
                isVisible
                  ? {
                      y: [0, -15, 0],
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{
                duration: 4 + Math.random() * 2, // Varied floating speeds
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: card.delay + 1.5,
              }}
            >
              <div className="relative group cursor-pointer">
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-purple-400/20 rounded-2xl blur-sm"
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: card.delay,
                  }}
                />
                <div
                  className="relative p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
                  style={{
                    width: `${isMobile ? card.mobileSize : card.size}px`,
                    height: `${isMobile ? card.mobileSize : card.size}px`,
                  }}
                >
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Floating particles (hydration-safe) */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-green-300/60 to-purple-300/60 rounded-full blur-sm"
            style={{
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
