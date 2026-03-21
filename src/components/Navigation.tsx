"use client";

import { motion } from "framer-motion";
import { useApp, type View } from "@/lib/store";
import {
  Kanban,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const NAV_ITEMS: { view: View; label: string; icon: typeof Kanban }[] = [
  { view: "board", label: "Board", icon: Kanban },
  { view: "blueprint", label: "Blueprint", icon: FileSearch },
  { view: "session", label: "Session", icon: MessageSquare },
  { view: "tollgate", label: "Tollgate", icon: ShieldCheck },
  { view: "cockpit", label: "Cockpit", icon: BarChart3 },
];

export function Navigation() {
  const { state, dispatch } = useApp();

  return (
    <motion.nav
      className="glass-nav fixed top-0 inset-x-0 z-50 flex items-center h-14 px-6"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <button
        onClick={() => dispatch({ type: "SET_VIEW", view: "hero" })}
        className="flex items-center gap-2 mr-8 group"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] flex items-center justify-center overflow-hidden p-0.5">
          <img src="/kestrel-logo.png" alt="Kestrel" className="w-full h-full object-contain brightness-0 invert" />
        </div>
        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
          Symphony
        </span>
        <span className="text-[10px] text-white/25 font-mono">by Lumicorp AI</span>
      </button>

      {/* Nav Items */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = state.currentView === view;
          return (
            <button
              key={view}
              onClick={() => dispatch({ type: "SET_VIEW", view })}
              className={`
                relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
                ${active
                  ? "text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="relative z-10">{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg bg-white/10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        {/* Active story indicator */}
        {state.activeStoryId && (
          <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded">
            {state.stories.find((s) => s.id === state.activeStoryId)?.key}
          </span>
        )}

        {/* Governance mode toggle */}
        <div className="flex items-center gap-0.5 text-[10px]">
          <button
            onClick={() => dispatch({ type: "SET_GOVERNANCE", mode: "enforced" })}
            className={`px-2 py-1 rounded-l-md transition-all ${
              state.governanceMode === "enforced"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-white/5 text-white/30 border border-white/10"
            }`}
          >
            Enforced
          </button>
          <button
            onClick={() => dispatch({ type: "SET_GOVERNANCE", mode: "advisory" })}
            className={`px-2 py-1 rounded-r-md transition-all ${
              state.governanceMode === "advisory"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-white/5 text-white/30 border border-white/10"
            }`}
          >
            Advisory
          </button>
        </div>

        {/* Online status */}
        <motion.div
          className="flex items-center gap-1.5 text-[10px] text-white/30"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
          <span className="font-mono">Online</span>
        </motion.div>
      </div>
    </motion.nav>
  );
}
