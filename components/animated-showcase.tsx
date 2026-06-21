"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface BrandCard {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number };
  mobilePosition: { x: number; y: number };
  rotate: { x: number; y: number };
  delay: number;
}

const brandCards: BrandCard[] = [
  {
    id: "nykaa",
    name: "Nykaa",
    image: "/images/anim/nykaa-card.png",
    position: { x: -460, y: -150 },
    mobilePosition: { x: -150, y: -150 },
    rotate: { x: 25, y: 25 },
    delay: 0.2,
  },
  {
    id: "amazon",
    name: "Amazon",
    image: "/images/anim/amazon-card.png",
    position: { x: 250, y: -150 },
    mobilePosition: { x: 30, y: -180 },
    rotate: { x: 30, y: -30 },
    delay: 0.4,
  },
  {
    id: "myntra",
    name: "Myntra",
    image: "/images/anim/myntra-card.png",
    position: { x: -420, y: 80 },
    mobilePosition: { x: -150, y: 80 },
    rotate: { x: 20, y: 20 },
    delay: 0.6,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    image: "/images/anim/flipkart-card.png",
    position: { x: 220, y: 80 },
    mobilePosition: { x: 30, y: 100 },
    rotate: { x: 25, y: -25 },
    delay: 0.8,
  },
  {
    id: "ajio",
    name: "AJIO",
    image: "/images/anim/ajio-card.png",
    position: { x: -100, y: -320 },
    mobilePosition: { x: -55, y: -300 },
    rotate: { x: 0, y: 0 },
    delay: 1.0,
  },
];

export default function AnimatedShowcase() {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const [showPhone, setShowPhone] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [particles, setParticles] = useState<
    { left: string; top: string; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    if (isInView) {
      setShowPhone(true);
      setButtonClicked(false);
    } else {
      // Reset animation state when out of view
      setShowPhone(false);
      setShowCards(false);
      setButtonClicked(false);
    }
  }, [isInView]);

  useEffect(() => {
    if (showPhone && !buttonClicked) {
      const timer = setTimeout(() => {
        setButtonClicked(true);
      }, 1000); // Auto-click after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showPhone, buttonClicked]);

  useEffect(() => {
    if (buttonClicked) {
      const timer = setTimeout(() => {
        setShowPhone(false);
        setShowCards(true);
      }, 1000); // Short delay after click
      return () => clearTimeout(timer);
    }
  }, [buttonClicked]);

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
    <div
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-green-50 to-purple-50 mx-5 mt-10 sm:mt-20 lg:mx-20 rounded-4xl"
    >
      {/* Central radial glow behind shoe */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-green-400/60 via-purple-400/40 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Intense animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/70 to-green-400/70 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.9, 0.5],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300/60 to-pink-400/60 rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
          x: [0, -40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-teal-300/60 to-emerald-300/60 rounded-full blur-sm"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Intense radial glow from center */}
      <div className="absolute inset-0 bg-gradient-radial from-white/40 via-green-50/20 to-transparent" />

      {/* Light rays effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-conic from-transparent via-green-200/20 to-transparent"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Main container */}
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="relative flex items-center justify-center">
          {/* Central Phone */}
          <motion.div
            className="relative z-20"
            initial={{ y: 0, rotateY: -30 }}
            animate={showPhone ? { y: 0 } : { y: 700 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="relative w-[200px] h-[350px] sm:w-[360px] sm:h-[620px]">
              <Image
                src="/images/anim/iphone-14-pro.png"
                alt="Phone"
                fill
                className="object-fill drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Central Shoe */}
          <motion.div
            className="absolute z-30 sm:top-35"
            initial={{ scale: 0.8, rotateY: -30 }}
            animate={
              showPhone
                ? {
                    scale: 1,
                    rotateZ: [0, 15, -15, 0],
                  }
                : { scale: 0.9 }
            }
            transition={{
              duration: 1.2,
              rotateY: {
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-green-400/30 via-purple-400/20 to-transparent blur-xl scale-150" />
            <div className="w-[280px] h-[180px] sm:w-[450px] sm:h-[300px]">
              <Image
                src="/images/anim/shoe.png"
                alt="Jordan Sneaker"
                fill
                className="relative drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Floating brand cards */}
        {brandCards.map((card) => (
          <motion.div
            key={card.id}
            className="absolute z-10"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{
              opacity: 0,
              scale: 0.3,
              x: 0,
              y: 0,
              z: -200,
              rotateX: 45,
              rotateY: -45,
            }}
            animate={
              showCards
                ? {
                    opacity: 1,
                    scale: 1,
                    x: isMobile ? card.mobilePosition.x : card.position.x,
                    y: isMobile ? card.mobilePosition.y : card.position.y,
                    z: 0,
                    rotateX: card.rotate.x,
                    rotateY: card.rotate.y,
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              delay: card.delay,
              ease: "easeOut",
            }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.div
              animate={
                showCards
                  ? {
                      y: [0, -10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: card.delay + 1.2,
              }}
            >
              <div className="relative group cursor-pointer">
                <motion.div
                  className="absolute -inset-4 border border-white bg-gradient-to-r from-green-300 via-purple-300 to-teal-300 rounded-3xl"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: card.delay,
                  }}
                />
                <div className="relative p-6 rounded-2xl w-[120] h-[80] sm:w-[200] sm:h-[140]">
                  <Image
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Find Price button */}
        <motion.div
          className="absolute bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            ...(showPhone ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }),
            scale: buttonClicked ? [1, 0.9, 1.05, 1] : 1,
            rotate: buttonClicked ? [0, 2, -2, 0] : 0,
          }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileTap={{ scale: 0.9, rotate: 2 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative group">
            <motion.div
              className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-teal-400/50 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.button
              className="relative bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 active:from-blue-800 active:to-blue-600 rounded-full px-8 py-4 flex items-center cursor-pointer gap-3 shadow-2xl border border-blue-400/30 transition-all duration-200 ease-in-out"
              whileHover={{
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
                y: -2,
              }}
              whileTap={{
                boxShadow: "0 10px 25px -12px rgba(59, 130, 246, 0.3)",
                y: 0,
              }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-white font-semibold text-sm sm:text-lg">
                Find Price
              </span>
            </motion.button>
          </div>
        </motion.div>

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
