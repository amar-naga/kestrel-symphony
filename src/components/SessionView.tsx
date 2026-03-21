"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import { RBAC_BUILD_MESSAGES, RBAC_BUILD_LOG } from "@/lib/sample-data";
import {
  FileText,
  Cpu,
  ShieldCheck,
  Activity,
  ClipboardCheck,
  Database,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench,
  ChevronRight,
  Code,
  TestTube,
  FileCode,
  ArrowRight,
} from "lucide-react";
import type { SessionMessage, SessionLogEntry, Artifact, PhaseState } from "@/lib/store";

/* ================================================================
   CONSTANTS & HELPERS
   ================================================================ */

const roleIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Requirements Dev": FileText,
  "Process Leader": ClipboardCheck,
  "Data Steward": Database,
  "Agent Engineer": Cpu,
  "Code Auditor": ShieldCheck,
  "Agent Ops": Activity,
};

const artifactIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  spec: FileText,
  code: Code,
  test: TestTube,
  config: FileCode,
  doc: FileText,
  schema: Database,
};

const ACTION_COLORS: Record<string, string> = {
  "Role joined": "#10b981",
  "Phase started": "#8b5cf6",
  "Phase ready": "#8b5cf6",
  "Code pushed": "#3b82f6",
  "Code updated": "#3b82f6",
  "Security finding": "#ef4444",
  "Security scan": "#10b981",
  "Artifact received": "#a855f6",
  "Cross-reference": "#f59e0b",
};

function getActionColor(action: string): string {
  return ACTION_COLORS[action] ?? "#6b7280";
}

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function humanModeLabel(mode: string): { label: string; color: string } {
  switch (mode) {
    case "collaborative":
      return { label: "Collaborative", color: "#10b981" };
    case "review":
      return { label: "Review", color: "#f59e0b" };
    case "delegated":
      return { label: "Delegated", color: "#8b5cf6" };
    default:
      return { label: mode, color: "#6b7280" };
  }
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function RoleAvatar({ role, color, size = 32 }: { role: string; color: string; iconName?: string; size?: number }) {
  const Icon = roleIconMap[role] ?? Cpu;
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `${color}25`,
        border: `2px solid ${color}60`,
        boxShadow: `0 0 12px ${color}20`,
        color,
      }}
    >
      <Icon size={size * 0.45} />
    </div>
  );
}

function McpBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-white/50 bg-white/[0.06] border border-white/[0.08]">
      <Wrench size={10} className="opacity-50" />
      {name}
    </span>
  );
}

/* ── Chat Message ────────────────────────────────────────── */

function ChatMessage({ msg, index }: { msg: SessionMessage; index: number }) {
  const roleColor = msg.roleColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="flex gap-3 px-4 py-3"
    >
      <RoleAvatar role={msg.role} color={roleColor} iconName={msg.roleIcon} size={36} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold" style={{ color: roleColor }}>
            {msg.role}
          </span>
          {msg.referencesRole && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/40">
              <ArrowRight size={9} />
              referencing {msg.referencesRole}
            </span>
          )}
          <span className="text-[10px] text-white/25 ml-auto shrink-0">{formatTime(msg.timestamp)}</span>
        </div>

        {/* Content */}
        <div
          className="text-sm text-white/75 leading-relaxed rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          {msg.content}
        </div>

        {/* Artifact chips */}
        {msg.artifacts && msg.artifacts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.artifacts.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium cursor-pointer transition-colors hover:bg-white/[0.08]"
                style={{
                  background: `${roleColor}12`,
                  color: roleColor,
                  border: `1px solid ${roleColor}25`,
                }}
              >
                <FileCode size={10} />
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Artifact Card ───────────────────────────────────────── */

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const Icon = artifactIconMap[artifact.type] ?? FileText;
  const roleColor =
    artifact.fromRole === "Agent Engineer" ? "#4361ee" :
    artifact.fromRole === "Code Auditor" ? "#e63946" :
    artifact.fromRole === "Requirements Dev" ? "#4361ee" :
    artifact.fromRole === "Process Leader" ? "#7b2ff7" :
    "#888";

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.06]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center rounded-lg shrink-0 mt-0.5"
          style={{
            width: 32,
            height: 32,
            background: `${roleColor}15`,
            border: `1px solid ${roleColor}25`,
          }}
        >
          <div style={{ color: roleColor }}><Icon size={16} /></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/85 truncate">{artifact.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: `${roleColor}15`, color: roleColor }}
            >
              {artifact.fromRole}
            </span>
          </div>
          {artifact.preview && (
            <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{artifact.preview}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Log Entry ───────────────────────────────────────────── */

function LogEntry({ entry }: { entry: SessionLogEntry }) {
  const actionColor = getActionColor(entry.action);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-start gap-3 px-4 py-2 text-xs"
    >
      <span className="text-white/25 shrink-0 font-mono w-10 mt-0.5">{formatTime(entry.timestamp)}</span>
      <span
        className="shrink-0 px-1.5 py-0.5 rounded font-medium"
        style={{ background: `${actionColor}18`, color: actionColor, fontSize: 10 }}
      >
        {entry.action}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-white/50">
          {entry.role && <span className="text-white/65 font-medium">{entry.role}</span>}
          {entry.tool && (
            <span className="text-white/35">
              {" "}
              via <span className="text-white/45">{entry.tool}</span>
            </span>
          )}
          {entry.details && (
            <span className="text-white/40">
              {" "}
              &mdash; {entry.details}
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SESSION VIEW
   ================================================================ */

export function SessionView() {
  const { state, dispatch } = useApp();
  const [visibleMessages, setVisibleMessages] = useState<SessionMessage[]>([]);
  const [rightTab, setRightTab] = useState<"artifacts" | "log">("artifacts");
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Find active story + active phase
  const activeStory = state.stories.find((s) => s.id === state.activeStoryId);
  const activePhase: PhaseState | undefined =
    activeStory?.phases?.find((p) => p.id === state.activePhaseId) ??
    activeStory?.phases?.find((p) => p.status === "active");

  // Blueprint phase for tools + human mode
  const blueprintPhase = activeStory?.blueprint?.phases?.find((bp) => bp.id === activePhase?.id);

  // Stagger messages on mount
  useEffect(() => {
    if (!activeStory || !activePhase) return;

    setVisibleMessages([]);
    const allMessages = RBAC_BUILD_MESSAGES;
    const timers: ReturnType<typeof setTimeout>[] = [];

    allMessages.forEach((msg, i) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
      }, (i + 1) * 800);
      timers.push(timer);
    });

    // Also set log entries
    dispatch({ type: "SET_LOG", entries: RBAC_BUILD_LOG });

    return () => timers.forEach(clearTimeout);
  }, [activeStory?.id, activePhase?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  // Auto-scroll log
  useEffect(() => {
    if (rightTab === "log") {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.sessionLog, rightTab]);

  /* ── Empty state ─────────────────────────────────────── */

  if (!activeStory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <Cpu size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">Select a story from the Board to start a session</p>
        </motion.div>
      </div>
    );
  }

  if (!activePhase) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No active phase for {activeStory.key}</p>
        </motion.div>
      </div>
    );
  }

  const hm = humanModeLabel(activePhase.humanMode);

  /* ── Main layout ─────────────────────────────────────── */

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* ── Top Bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 px-6 py-3 flex items-center gap-4 border-b border-white/[0.06]"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Phase + Story key */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-white/90">{activePhase.name} Phase</span>
          <span className="text-xs font-mono text-white/30 bg-white/[0.06] px-2 py-0.5 rounded">
            {activeStory.key}
          </span>
        </div>

        {/* Active roles */}
        <div className="flex items-center gap-2 ml-4">
          {activePhase.roles.map((role) => {
            const Icon = roleIconMap[role] ?? Cpu;
            const color =
              role === "Agent Engineer" ? "#4361ee" :
              role === "Code Auditor" ? "#e63946" :
              role === "Requirements Dev" ? "#4361ee" :
              role === "Process Leader" ? "#7b2ff7" :
              role === "Agent Ops" ? "#00c896" :
              "#888";
            return (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${color}15`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon size={12} />
                {role}
              </span>
            );
          })}
        </div>

        {/* MCP tools */}
        {blueprintPhase && (
          <div className="flex items-center gap-1.5 ml-3">
            {blueprintPhase.tools.map((t) => (
              <McpBadge key={t} name={t} />
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Human mode */}
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: `${hm.color}15`,
            color: hm.color,
            border: `1px solid ${hm.color}30`,
          }}
        >
          <CheckCircle size={11} />
          {hm.label}
        </span>

        {/* Complete Phase button */}
        <button
          onClick={() => dispatch({ type: "SET_VIEW", view: "tollgate" })}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
            boxShadow: "0 2px 12px rgba(67,97,238,0.3)",
          }}
        >
          Complete Phase
          <ArrowRight size={13} />
        </button>
      </motion.div>

      {/* ── Split Panels ─────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left: Agent Chat (60%) ─────────────────────── */}
        <div
          className="flex flex-col"
          style={{
            width: "60%",
            background: "rgba(0,0,0,0.15)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            <AnimatePresence>
              {visibleMessages.map((msg, i) => (
                <ChatMessage key={msg.id} msg={msg} index={i} />
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-4 py-3 border-t border-white/[0.06]"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask the team..."
                className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none"
              />
              <button
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/[0.08]"
                style={{ color: inputValue ? "#4361ee" : "rgba(255,255,255,0.2)" }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Artifacts + Log (40%) ────────────────── */}
        <div
          className="flex flex-col"
          style={{
            width: "40%",
            background: "rgba(255,255,255,0.015)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Tab switcher */}
          <div className="shrink-0 flex border-b border-white/[0.06]">
            {(["artifacts", "log"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors relative"
                style={{
                  color: rightTab === tab ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                }}
              >
                {tab === "artifacts" ? "Artifacts" : "Execution Log"}
                {rightTab === tab && (
                  <motion.div
                    layoutId="session-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #4361ee, #7b2ff7)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {rightTab === "artifacts" ? (
                <motion.div
                  key="artifacts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 space-y-3"
                >
                  {/* Combine artifacts from all completed and active phases */}
                  {activeStory.phases
                    ?.filter((p) => p.status === "active" || p.status === "passed")
                    .flatMap((p) =>
                      p.artifacts.map((a) => (
                        <ArtifactCard key={`${p.id}-${a.name}`} artifact={a} />
                      ))
                    )}

                  {(!activeStory.phases ||
                    activeStory.phases.flatMap((p) => p.artifacts).length === 0) && (
                    <div className="text-center py-12">
                      <FileText size={24} className="text-white/15 mx-auto mb-2" />
                      <p className="text-xs text-white/25">No artifacts yet</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="log"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-2"
                >
                  {state.sessionLog.map((entry) => (
                    <LogEntry key={entry.id} entry={entry} />
                  ))}
                  {state.sessionLog.length === 0 && (
                    <div className="text-center py-12">
                      <Activity size={24} className="text-white/15 mx-auto mb-2" />
                      <p className="text-xs text-white/25">No log entries</p>
                    </div>
                  )}
                  <div ref={logEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionView;
