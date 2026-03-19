"use client";

import { motion } from "framer-motion";
import { useTeam, View } from "@/lib/store";
import { LayoutGrid, GitBranch, Rocket, Gauge, MessageSquare } from "lucide-react";

const tabs: { id: View; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "catalog", label: "Role Catalog", icon: LayoutGrid },
  { id: "composer", label: "Composer", icon: GitBranch },
  { id: "deploy", label: "Deploy", icon: Rocket },
  { id: "cockpit", label: "Cockpit", icon: Gauge },
  { id: "workspace", label: "Workspace", icon: MessageSquare },
];

export function Navigation() {
  const { state, dispatch } = useTeam();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: "SET_VIEW", view: "hero" })}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-cyan)] flex items-center justify-center shadow-lg overflow-hidden p-0.5">
            <img src="/kestrel-logo.png" alt="Kestrel" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <span className="font-semibold text-white/90 text-sm tracking-wide">
              Kestrel Symphony
            </span>
            <span className="text-[10px] text-white/30 ml-2 font-mono">by Lumicorp AI</span>
          </div>
        </motion.button>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass-subtle px-1.5 py-1.5">
          {tabs.map((tab) => {
            const isActive = state.currentView === tab.id;
            const Icon = tab.icon;
            const isDisabled =
              tab.id !== "catalog" && state.selectedRoles.length === 0;

            return (
              <motion.button
                key={tab.id}
                whileHover={!isDisabled ? { scale: 1.04 } : undefined}
                whileTap={!isDisabled ? { scale: 0.97 } : undefined}
                onClick={() => !isDisabled && dispatch({ type: "SET_VIEW", view: tab.id })}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  isDisabled
                    ? "text-white/15 cursor-not-allowed"
                    : isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/70 cursor-pointer"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/8 rounded-xl border border-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={15} />
                <span className="relative z-10">{tab.label}</span>
                {tab.id === "catalog" && state.selectedRoles.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 bg-[var(--accent-purple)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    style={{ boxShadow: "0 0 10px rgba(123,47,247,0.4)" }}
                  >
                    {state.selectedRoles.length}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 text-xs text-white/30">
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] pulse-dot" />
            <span className="font-mono">Online</span>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
