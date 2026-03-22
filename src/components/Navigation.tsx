"use client";

import { motion } from "framer-motion";
import { useApp, type View } from "@/lib/store";
import {
  Kanban,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  GitBranch,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS: { view: View; label: string; icon: typeof Kanban }[] = [
  { view: "board", label: "Board", icon: Kanban },
  { view: "blueprint", label: "Blueprint", icon: FileSearch },
  { view: "session", label: "Session", icon: MessageSquare },
  { view: "tollgate", label: "Tollgate", icon: ShieldCheck },
  { view: "cockpit", label: "Cockpit", icon: BarChart3 },
];

export function Navigation({ onToggleInspector, theme, onToggleTheme }: { onToggleInspector?: () => void; theme?: "dark" | "light"; onToggleTheme?: () => void }) {
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
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B2C] to-[#FF8F5C] flex items-center justify-center overflow-hidden p-0.5">
          <img src="/kestrel-logo.png" alt="Kestrel" className="w-full h-full object-contain brightness-0 invert" />
        </div>
        <span
          className="text-sm font-semibold transition-colors"
          style={{ color: theme === "light" ? "#222222" : "rgba(255,255,255,0.92)" }}
        >
          Symphony
        </span>
        <span
          className="text-[10px] font-mono"
          style={{ color: theme === "light" ? "#999999" : "rgba(255,255,255,0.50)" }}
        >
          by Lumi AI
        </span>
      </button>

      {/* Nav Items */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = state.currentView === view;
          const isLight = theme === "light";
          return (
            <button
              key={view}
              onClick={() => dispatch({ type: "SET_VIEW", view })}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                color: active
                  ? isLight ? "#111111" : "rgba(255,255,255,0.95)"
                  : isLight ? "#666666" : "rgba(255,255,255,0.65)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                lineHeight: "1",
                verticalAlign: "middle",
              }}
            >
              <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ position: "relative", zIndex: 10 }}>{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: isLight ? "#f0f0f0" : "rgba(255,255,255,0.1)",
                    border: isLight ? "1px solid #d4d4d4" : "1px solid rgba(255,255,255,0.1)",
                  }}
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
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{
              background: theme === "light" ? "#f0f0f0" : "rgba(255,255,255,0.05)",
              color: theme === "light" ? "#777777" : "rgba(255,255,255,0.55)",
              border: theme === "light" ? "1px solid #e0e0e0" : "none",
            }}
          >
            {state.stories.find((s) => s.id === state.activeStoryId)?.key}
          </span>
        )}

        {/* Arc config */}
        <motion.button
          onClick={() => dispatch({ type: "SET_VIEW", view: "arc" })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: state.currentView === "arc"
              ? "linear-gradient(135deg, rgba(255,107,44,0.2), rgba(255,143,92,0.2))"
              : theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.05)",
            border: state.currentView === "arc"
              ? "1px solid rgba(255,107,44,0.35)"
              : theme === "light" ? "1px solid #d4d4d4" : "1px solid rgba(255,255,255,0.08)",
            color: state.currentView === "arc" ? "#FF6B2C" : theme === "light" ? "#666666" : "rgba(255,255,255,0.55)",
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <GitBranch size={12} />
          Arc
        </motion.button>

        {/* Theme toggle */}
        {onToggleTheme && (
          <motion.button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            style={{
              background: "var(--surface-primary)",
              border: "1px solid var(--border-primary)",
              color: theme === "dark" ? "#FF8F5C" : "#FF6B2C",
            }}
            whileHover={{ scale: 1.08, background: "var(--surface-hover)" }}
            whileTap={{ scale: 0.95 }}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </motion.button>
        )}

        {/* Platform Inspector toggle */}
        <motion.button
          onClick={onToggleInspector}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,44,0.12), rgba(255,143,92,0.12))",
            border: "1px solid rgba(255,107,44,0.25)",
            color: "#FF8F5C",
          }}
          whileHover={{
            background: "linear-gradient(135deg, rgba(255,107,44,0.2), rgba(255,143,92,0.2))",
            borderColor: "rgba(255,107,44,0.4)",
          }}
          whileTap={{ scale: 0.97 }}
        >
          <Settings size={12} />
          Platform
        </motion.button>

        {/* Governance mode toggle */}
        <div className="flex items-center gap-0.5 text-[10px]">
          <button
            onClick={() => dispatch({ type: "SET_GOVERNANCE", mode: "enforced" })}
            className="px-2 py-1 rounded-l-md transition-all border"
            style={state.governanceMode === "enforced"
              ? { background: "rgba(239,68,68,0.12)", color: "#f87171", borderColor: "rgba(239,68,68,0.3)" }
              : { background: theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.05)", color: theme === "light" ? "#888888" : "rgba(255,255,255,0.55)", borderColor: theme === "light" ? "#d4d4d4" : "rgba(255,255,255,0.1)" }
            }
          >
            Enforced
          </button>
          <button
            onClick={() => dispatch({ type: "SET_GOVERNANCE", mode: "advisory" })}
            className="px-2 py-1 rounded-r-md transition-all border"
            style={state.governanceMode === "advisory"
              ? { background: "rgba(245,158,11,0.12)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }
              : { background: theme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.05)", color: theme === "light" ? "#888888" : "rgba(255,255,255,0.55)", borderColor: theme === "light" ? "#d4d4d4" : "rgba(255,255,255,0.1)" }
            }
          >
            Advisory
          </button>
        </div>

        {/* About / Pitch page link */}
        <a
          href="/pitch"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: theme === "light" ? "#888" : "rgba(255,255,255,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 10px",
            borderRadius: 6,
            border: theme === "light" ? "1px solid #e0e0e0" : "1px solid rgba(255,255,255,0.1)",
            transition: "all 0.2s",
          }}
        >
          About <ChevronRight size={10} />
        </a>

        {/* Online status */}
        <motion.div
          className="flex items-center gap-1.5 text-[10px]"
          style={{ color: theme === "light" ? "#999999" : "rgba(255,255,255,0.55)" }}
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
