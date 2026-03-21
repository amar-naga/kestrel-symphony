"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/store";
import {
  RBAC_BUILD_MESSAGES,
  RBAC_BUILD_LOG,
  RBAC_PLAN_MESSAGES,
  RBAC_PLAN_LOG,
  RBAC_DEPLOY_MESSAGES,
  RBAC_DEPLOY_LOG,
  generateSessionMessages,
  generateAgentReply,
} from "@/lib/sample-data";
import {
  FileText,
  Cpu,
  ShieldCheck,
  Activity,
  ClipboardCheck,
  Database,
  Send,
  CheckCircle,
  Clock,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Code,
  TestTube,
  FileCode,
  ArrowRight,
  Loader2,
  Terminal,
  GitBranch,
  Zap,
  CircleDot,
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
  "Role joined": "#4ade80",
  "Phase started": "#FF6B2C",
  "Phase ready": "#FF6B2C",
  "Code pushed": "#999999",
  "Code updated": "#999999",
  "Security finding": "#f87171",
  "Security scan": "#4ade80",
  "Artifact received": "#FF8F5C",
  "Cross-reference": "#fbbf24",
  "MCP connected": "#888888",
  "Tests passing": "#4ade80",
  "Rate limit hit — retrying": "#f59e0b",
  "Human input processed": "#4ade80",
};

const AGENT_ACTIVITIES: Record<string, string[]> = {
  "Agent Engineer": [
    "Analyzing requirements spec...",
    "Scaffolding middleware layer...",
    "Writing permission check logic...",
    "Pushing to GitHub via MCP...",
    "Adding unit tests...",
    "Adding tenant scoping...",
    "47 tests written and passing ✓",
  ],
  "Code Auditor": [
    "Loading security review context...",
    "Scanning permission model...",
    "Cross-referencing Plan phase artifacts...",
    "Reviewing tenant isolation...",
    "Running Snyk security scan...",
    "0 vulnerabilities detected ✓",
  ],
  "Requirements Dev": [
    "Loading epic context from Jira...",
    "Analyzing auth module patterns...",
    "Mapping permission groups...",
    "Defining role hierarchy...",
    "Writing acceptance criteria...",
    "Spec complete ✓",
  ],
  "Process Leader": [
    "Loading SOC 2 compliance requirements...",
    "Defining approval gates...",
    "Analyzing edge cases...",
    "Validating acceptance criteria...",
    "Finalizing gate definitions...",
    "Approval gates defined ✓",
  ],
  "Agent Ops": [
    "Running CI pipeline...",
    "Deploying to staging...",
    "Executing smoke tests...",
    "Configuring monitoring alarms...",
    "Promoting to production...",
    "Production deploy complete ✓",
  ],
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
      return { label: "Collaborative", color: "#FF6B2C" };
    case "review":
      return { label: "Review-based", color: "#fbbf24" };
    case "delegated":
      return { label: "Delegated", color: "#4ade80" };
    default:
      return { label: mode, color: "#6b7280" };
  }
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function RoleAvatar({ role, color, active, size = 32 }: { role: string; color: string; iconName?: string; size?: number; active?: boolean }) {
  const Icon = roleIconMap[role] ?? Cpu;
  return (
    <div className="relative">
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: size,
          height: size,
          background: `${color}25`,
          border: `2px solid ${color}60`,
          boxShadow: active ? `0 0 16px ${color}40` : `0 0 8px ${color}15`,
          color,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Icon size={size * 0.45} />
      </div>
      {active && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{ background: color, borderColor: "var(--background)" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function McpBadge({ name, connected }: { name: string; connected?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-white/50 bg-white/[0.06] border border-white/[0.08]">
      {connected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      <Wrench size={10} className="opacity-50" />
      {name}
    </span>
  );
}

/* ── Typing Indicator ─────────────────────────────────────── */

function TypingIndicator({ role, color, activity }: { role: string; color: string; activity: string }) {
  const Icon = roleIconMap[role] ?? Cpu;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3 px-4 py-3"
    >
      <RoleAvatar role={role} color={color} size={36} active />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold" style={{ color }}>{role}</span>
          <motion.span
            className="text-[10px] text-white/30 flex items-center gap-1"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 size={10} className="animate-spin" />
            working
          </motion.span>
        </div>
        <div
          className="text-sm text-white/50 leading-relaxed rounded-xl px-4 py-3 flex items-center gap-2"
          style={{
            background: "var(--surface-secondary)",
            border: `1px solid ${color}15`,
            backdropFilter: "blur(12px)",
          }}
        >
          <Terminal size={13} style={{ color }} className="shrink-0" />
          <motion.span
            key={activity}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs"
            style={{ color: `${color}aa` }}
          >
            {activity}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Live Activity Bar ─────────────────────────────────────── */

function LiveActivityBar({ agents, progress }: { agents: { role: string; color: string; status: string }[]; progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-2 flex items-center gap-4 border-b border-white/[0.04]"
      style={{ background: "var(--surface-secondary)" }}
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-[10px] font-mono text-white/25 shrink-0">Progress</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #FF6B2C, #FF8F5C)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="text-[10px] font-mono text-white/30 tabular-nums">{progress}%</span>
      </div>

      {/* Agent status chips */}
      <div className="flex items-center gap-2 shrink-0">
        {agents.map((a) => (
          <motion.span
            key={a.role}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              background: `${a.color}12`,
              color: a.color,
              border: `1px solid ${a.color}25`,
            }}
            animate={a.status === "active" ? { borderColor: [`${a.color}25`, `${a.color}60`, `${a.color}25`] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {a.status === "active" ? (
              <CircleDot size={8} />
            ) : a.status === "done" ? (
              <CheckCircle size={8} />
            ) : (
              <Clock size={8} />
            )}
            {a.role.split(" ").pop()}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Chat Message ────────────────────────────────────────── */

function ChatMessage({ msg, index }: { msg: SessionMessage; index: number }) {
  const roleColor = msg.roleColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
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
            background: "var(--surface-secondary)",
            border: "1px solid var(--border-secondary)",
            backdropFilter: "blur(12px)",
          }}
        >
          {msg.content}
        </div>

        {/* Artifact chips */}
        {msg.artifacts && msg.artifacts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.artifacts.map((a) => (
              <motion.span
                key={a}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium cursor-pointer transition-colors hover:bg-white/[0.08]"
                style={{
                  background: `${roleColor}12`,
                  color: roleColor,
                  border: `1px solid ${roleColor}25`,
                }}
              >
                <FileCode size={10} />
                {a}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Artifact Card ───────────────────────────────────────── */

function ArtifactCard({ artifact, isNew, onExpand }: { artifact: Artifact; isNew?: boolean; onExpand?: (artifact: Artifact) => void }) {
  const Icon = artifactIconMap[artifact.type] ?? FileText;
  const roleColor =
    artifact.fromRole === "Agent Engineer" ? "#FF6B2C" :
    artifact.fromRole === "Code Auditor" ? "#f87171" :
    artifact.fromRole === "Requirements Dev" ? "#FF6B2C" :
    artifact.fromRole === "Process Leader" ? "#8B8B8B" :
    "#888";

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => onExpand?.(artifact)}
      className="rounded-xl px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.06] relative"
      style={{
        background: "var(--surface-secondary)",
        border: isNew ? `1px solid ${roleColor}30` : "1px solid var(--border-secondary)",
        backdropFilter: "blur(8px)",
      }}
    >
      {isNew && (
        <motion.div
          className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{ background: `${roleColor}20`, color: roleColor }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: 3 }}
        >
          new
        </motion.div>
      )}
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
            <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed font-mono">{artifact.preview}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Log Entry ───────────────────────────────────────────── */

function LogEntry({ entry, isNew }: { entry: SessionLogEntry; isNew?: boolean }) {
  const actionColor = getActionColor(entry.action);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 px-4 py-2 text-xs ${isNew ? "bg-white/[0.02]" : ""}`}
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
      {isNew && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: 3 }}
        />
      )}
    </motion.div>
  );
}

/* ── Phase Complete Animation ─────────────────────────────── */

function PhaseCompleteOverlay({ onStay, onTollgate, phaseName }: { onStay: () => void; onTollgate: () => void; phaseName?: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <CheckCircle size={64} className="text-emerald-400 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white/90 mb-2">{phaseName ?? "Phase"} Complete</h2>
        <p className="text-sm text-white/50 mb-6">All agents have finished their work. Ready for tollgate evaluation.</p>
        <div className="flex items-center gap-3 justify-center">
          <motion.button
            onClick={onStay}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: "var(--surface-hover)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
            }}
            whileHover={{ scale: 1.05, background: "var(--surface-hover)" }}
            whileTap={{ scale: 0.95 }}
          >
            Stay in Session
          </motion.button>
          <motion.button
            onClick={onTollgate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #FF6B2C, #FF8F5C)",
              boxShadow: "0 4px 20px rgba(255,107,44,0.4)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShieldCheck size={16} />
            Run Tollgate Evaluation
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   SESSION VIEW
   ================================================================ */

export function SessionView() {
  const { state, dispatch } = useApp();
  const [visibleMessages, setVisibleMessages] = useState<SessionMessage[]>([]);
  const [visibleLogs, setVisibleLogs] = useState<SessionLogEntry[]>([]);
  const [rightTab, setRightTab] = useState<"artifacts" | "log">("artifacts");
  const [inputValue, setInputValue] = useState("");
  const [typingAgent, setTypingAgent] = useState<{ role: string; color: string; activity: string } | null>(null);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<{ role: string; color: string; status: string }[]>([]);
  const [newArtifactIds, setNewArtifactIds] = useState<Set<string>>(new Set());
  const [sessionArtifacts, setSessionArtifacts] = useState<Artifact[]>([]);
  const [expandedArtifact, setExpandedArtifact] = useState<Artifact | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Find active story + active phase
  const activeStory = state.stories.find((s) => s.id === state.activeStoryId);
  const activePhase: PhaseState | undefined =
    activeStory?.phases?.find((p) => p.id === state.activePhaseId) ??
    activeStory?.phases?.find((p) => p.status === "active");

  // Blueprint phase for tools + human mode
  const blueprintPhase = activeStory?.blueprint?.phases?.find((bp) => bp.id === activePhase?.id);

  // Stagger messages with typing indicators
  useEffect(() => {
    if (!activeStory || !activePhase) return;

    setVisibleMessages([]);
    setVisibleLogs([]);
    setPhaseProgress(0);
    setShowComplete(false);
    setNewArtifactIds(new Set());
    setSessionArtifacts([]);

    const phaseId = activePhase.id;
    const { messages: allMessages, log: allLogs } = generateSessionMessages(activeStory, activePhase.id as any);
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Set initial agent statuses
    const roleColors: Record<string, string> = {
      "Agent Engineer": "#FF6B2C",
      "Code Auditor": "#f87171",
      "Requirements Dev": "#FF6B2C",
      "Process Leader": "#8B8B8B",
      "Agent Ops": "#FF8F5C",
      "Data Steward": "#666666",
    };
    setAgentStatuses(
      activePhase.roles.map((r) => ({
        role: r,
        color: roleColors[r] ?? "#888",
        status: "waiting",
      }))
    );

    // Stagger: typing indicator → message → log entries
    let elapsed = 500;

    allMessages.forEach((msg, i) => {
      const role = msg.role;
      const color = msg.roleColor;
      const activities = AGENT_ACTIVITIES[role] ?? ["Processing..."];
      const activityIdx = Math.min(i, activities.length - 1);

      // Show typing indicator
      timers.push(setTimeout(() => {
        setTypingAgent({ role, color, activity: activities[activityIdx] });
        setAgentStatuses((prev) =>
          prev.map((a) => a.role === role ? { ...a, status: "active" } : a)
        );
      }, elapsed));

      elapsed += 1200 + Math.random() * 800; // Variable typing duration

      // Show message, hide typing
      timers.push(setTimeout(() => {
        setTypingAgent(null);
        setVisibleMessages((prev) => [...prev, msg]);
        setPhaseProgress(Math.min(Math.round(((i + 1) / allMessages.length) * 95), 95));

        // Mark new artifacts and add to session artifacts list
        if (msg.artifacts) {
          setNewArtifactIds((prev) => {
            const next = new Set(prev);
            msg.artifacts!.forEach((a) => next.add(a));
            return next;
          });
          setSessionArtifacts((prev) => {
            const existing = new Set(prev.map((a) => a.name));
            const newOnes = msg.artifacts!
              .filter((name) => !existing.has(name))
              .map((name) => ({
                name,
                type: name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".sql") ? "code" as const :
                      name.endsWith(".test.ts") ? "test" as const :
                      name.endsWith(".md") ? "doc" as const : "doc" as const,
                fromRole: msg.role,
                preview: `Generated by ${msg.role} during ${activePhase?.name ?? ""} phase`,
              }));
            return [...prev, ...newOnes];
          });
        }
      }, elapsed));

      elapsed += 400;

      // Add corresponding log entries
      const logsForThisMsg = allLogs.filter((_, li) => {
        const msgIdx = Math.floor((li / allLogs.length) * allMessages.length);
        return msgIdx === i;
      });

      logsForThisMsg.forEach((log, li) => {
        timers.push(setTimeout(() => {
          setVisibleLogs((prev) => [...prev, log]);
        }, elapsed + li * 200));
      });

      // After 3rd message (i === 2), show a retry event
      if (i === 2) {
        timers.push(setTimeout(() => {
          setVisibleLogs((prev) => [...prev, {
            id: "l-retry",
            timestamp: new Date().toISOString(),
            action: "Rate limit hit — retrying",
            role: msg.role,
            details: "Claude API returned 429. Backing off 2s and retrying. Attempt 2/3 succeeded.",
          }]);
        }, elapsed + 200));
      }

      elapsed += 600;
    });

    // Phase complete
    timers.push(setTimeout(() => {
      setPhaseProgress(100);
      setAgentStatuses((prev) => prev.map((a) => ({ ...a, status: "done" })));
      // Add final log entry
      setVisibleLogs((prev) => [
        ...prev,
        {
          id: "l-complete",
          timestamp: new Date().toISOString(),
          action: "Phase ready",
          role: "Symphony",
          details: `${activePhase.name} phase complete — triggering tollgate evaluation`,
        },
      ]);
    }, elapsed));

    timers.push(setTimeout(() => {
      setShowComplete(true);
    }, elapsed + 800));

    return () => timers.forEach(clearTimeout);
  }, [activeStory?.id, activePhase?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, typingAgent]);

  // Auto-scroll log
  useEffect(() => {
    if (rightTab === "log") {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLogs, rightTab]);

  /* ── Chat send handler ──────────────────────────────── */

  function handleSendMessage() {
    if (!inputValue.trim() || !activeStory || !activePhase) return;

    const userMsg: SessionMessage = {
      id: `user-${Date.now()}`,
      role: "You",
      roleIcon: "User",
      roleColor: "#888888",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    setVisibleMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Show typing indicator
    const primaryRole = activePhase.roles[0];
    const roleColors: Record<string, string> = {
      "Agent Engineer": "#FF6B2C",
      "Code Auditor": "#f87171",
      "Requirements Dev": "#FF6B2C",
      "Process Leader": "#8B8B8B",
      "Agent Ops": "#FF8F5C",
      "Data Steward": "#666666",
    };
    setTypingAgent({ role: primaryRole, color: roleColors[primaryRole] ?? "#888", activity: "Thinking..." });

    setTimeout(() => {
      setTypingAgent(null);
      const reply = generateAgentReply(activeStory, activePhase.id as any, inputValue);
      setVisibleMessages((prev) => [...prev, reply]);

      // Also add a log entry
      setVisibleLogs((prev) => [...prev, {
        id: `log-reply-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "Human input processed",
        role: primaryRole,
        details: `Responded to user query about ${activeStory.component} module`,
      }]);
    }, 1500);
  }

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
          <p className="text-white/40 text-sm mb-1">No active session</p>
          <p className="text-white/20 text-xs">Select a story from the Board to start</p>
          <button
            onClick={() => dispatch({ type: "SET_VIEW", view: "board" })}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#FF6B2C] bg-[#FF6B2C]/10 border border-[#FF6B2C]/20 hover:bg-[#FF6B2C]/15 transition-colors"
          >
            Go to Board
            <ArrowRight size={12} />
          </button>
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
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Phase Complete Overlay */}
      <AnimatePresence>
        {showComplete && (
          <PhaseCompleteOverlay
            phaseName={activePhase?.name}
            onStay={() => {
              setShowComplete(false);
            }}
            onTollgate={() => {
              setShowComplete(false);
              if (activeStory && activePhase) {
                dispatch({ type: "COMPLETE_PHASE", storyId: activeStory.id, phaseId: activePhase.id as "plan" | "design" | "build" | "deploy" });
              }
              dispatch({ type: "SET_VIEW", view: "tollgate" });
            }}
          />
        )}
      </AnimatePresence>

      {/* Artifact Preview Modal */}
      <AnimatePresence>
        {expandedArtifact && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setExpandedArtifact(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-xl p-6 max-w-lg w-full mx-4"
              style={{ background: "var(--panel-bg)", border: "1px solid var(--border-primary)" }}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{expandedArtifact.name}</h3>
                <button onClick={() => setExpandedArtifact(null)} className="text-white/40 hover:text-white/70">&#10005;</button>
              </div>
              <div className="text-xs font-mono p-4 rounded-lg overflow-auto max-h-64"
                style={{ background: "var(--surface-primary)", border: "1px solid var(--border-secondary)", color: "var(--text-secondary)" }}>
                {expandedArtifact.preview || "No preview available"}
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11px]" style={{ color: "var(--text-faint)" }}>
                <span>Type: {expandedArtifact.type}</span>
                <span>From: {expandedArtifact.fromRole}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 px-6 py-3 flex items-center gap-4 border-b border-white/[0.06]"
        style={{
          background: "var(--surface-secondary)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Back to Board */}
        <button
          onClick={() => dispatch({ type: "SET_VIEW", view: "board" })}
          className="text-xs flex items-center gap-1 mr-3 transition-colors"
          style={{ color: "var(--text-faint)" }}
        >
          <ChevronLeft size={14} />
          Board
        </button>

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
              role === "Agent Engineer" ? "#FF6B2C" :
              role === "Code Auditor" ? "#f87171" :
              role === "Requirements Dev" ? "#FF6B2C" :
              role === "Process Leader" ? "#8B8B8B" :
              role === "Agent Ops" ? "#FF8F5C" :
              "#888";
            const agentStatus = agentStatuses.find((a) => a.role === role);
            return (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${color}15`,
                  color,
                  border: `1px solid ${agentStatus?.status === "active" ? `${color}60` : `${color}30`}`,
                  transition: "border-color 0.3s ease",
                }}
              >
                <Icon size={12} />
                {role}
                {agentStatus?.status === "active" && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full ml-0.5"
                    style={{ background: color }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* MCP tools */}
        {blueprintPhase && (
          <div className="flex items-center gap-1.5 ml-3">
            {blueprintPhase.tools.map((t) => (
              <McpBadge key={t} name={t} connected />
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Skip to complete (demo shortcut) */}
        {!showComplete && (
          <motion.button
            onClick={() => setShowComplete(true)}
            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: "var(--surface-primary)",
              border: "1px solid var(--border-primary)",
              color: "var(--text-faint)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Skip to Complete ⏩
          </motion.button>
        )}

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
            background: "linear-gradient(135deg, #FF6B2C, #FF8F5C)",
            boxShadow: "0 2px 12px rgba(255,107,44,0.3)",
          }}
        >
          Complete Phase
          <ArrowRight size={13} />
        </button>
      </motion.div>

      {/* ── Live Activity Bar ─────────────────────────────── */}
      <LiveActivityBar agents={agentStatuses} progress={phaseProgress} />

      {/* ── Split Panels ─────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left: Agent Chat (60%) ─────────────────────── */}
        <div
          className="flex flex-col"
          style={{
            width: "60%",
            background: "rgba(0,0,0,0.15)",
            borderRight: "1px solid var(--border-faint)",
          }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            <AnimatePresence>
              {visibleMessages.map((msg, i) => (
                <ChatMessage key={msg.id} msg={msg} index={i} />
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {typingAgent && (
                <TypingIndicator
                  role={typingAgent.role}
                  color={typingAgent.color}
                  activity={typingAgent.activity}
                />
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 px-4 py-3 border-t border-white/[0.06]"
            style={{
              background: "var(--surface-secondary)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "var(--surface-primary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                placeholder="Ask the team..."
                className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/[0.08]"
                style={{ color: inputValue ? "#FF6B2C" : "var(--text-ghost)" }}
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
            background: "var(--surface-secondary)",
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
                  color: rightTab === tab ? "var(--text-primary)" : "var(--text-faint)",
                }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {tab === "artifacts" ? "Artifacts" : "Execution Log"}
                  {tab === "log" && visibleLogs.length > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/30 tabular-nums">
                      {visibleLogs.length}
                    </span>
                  )}
                </span>
                {rightTab === tab && (
                  <motion.div
                    layoutId="session-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #FF6B2C, #FF8F5C)" }}
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
                  {/* Combine: phase artifacts + session-generated artifacts */}
                  {(() => {
                    const phaseArtifacts = activeStory.phases
                      ?.filter((p) => p.status === "active" || p.status === "passed")
                      .flatMap((p) => p.artifacts) ?? [];
                    const seen = new Set(phaseArtifacts.map((a) => a.name));
                    const combined = [
                      ...phaseArtifacts,
                      ...sessionArtifacts.filter((a) => !seen.has(a.name)),
                    ];
                    return combined.length > 0 ? (
                      combined.map((a) => (
                        <ArtifactCard
                          key={a.name}
                          artifact={a}
                          isNew={newArtifactIds.has(a.name)}
                          onExpand={setExpandedArtifact}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText size={24} className="text-white/15 mx-auto mb-2" />
                        <p className="text-xs text-white/25">Artifacts will appear as agents produce them</p>
                      </div>
                    );
                  })()}
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
                  {visibleLogs.map((entry, i) => (
                    <LogEntry key={entry.id} entry={entry} isNew={i >= visibleLogs.length - 2} />
                  ))}
                  {visibleLogs.length === 0 && (
                    <div className="text-center py-12">
                      <Activity size={24} className="text-white/15 mx-auto mb-2" />
                      <p className="text-xs text-white/25">Execution log loading...</p>
                      <motion.div
                        className="w-8 h-0.5 bg-white/10 rounded mx-auto mt-3 overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-[#FF6B2C] rounded"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{ width: "50%" }}
                        />
                      </motion.div>
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
