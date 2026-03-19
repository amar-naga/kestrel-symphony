"use client";

import { motion } from "framer-motion";

const orbs = [
  { x: "15%", y: "30%", size: 400, color: "rgba(123, 47, 247, 0.15)", delay: 0, duration: 25 },
  { x: "75%", y: "20%", size: 350, color: "rgba(67, 97, 238, 0.1)", delay: 2, duration: 30 },
  { x: "50%", y: "70%", size: 300, color: "rgba(0, 212, 255, 0.08)", delay: 4, duration: 22 },
  { x: "85%", y: "65%", size: 250, color: "rgba(0, 200, 150, 0.06)", delay: 1, duration: 28 },
  { x: "30%", y: "80%", size: 200, color: "rgba(123, 47, 247, 0.08)", delay: 3, duration: 35 },
];

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
