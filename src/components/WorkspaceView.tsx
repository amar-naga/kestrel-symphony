"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ROLES } from "@/lib/roles";
import { useTeam } from "@/lib/store";
import { RoleIcon } from "./RoleIcon";
import {
  Send,
  CheckCircle2,
  Shield,
  AlertTriangle,
  FileText,
  Database,
  BarChart3,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
  RefreshCw,
  Download,
  Bot,
  User,
  Workflow,
  Activity,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  type: "user" | "agent" | "tollgate" | "artifact" | "handoff" | "system";
  role?: string;
  roleIcon?: string;
  roleColor?: string;
  content: string;
  timestamp: string;
  artifact?: {
    title: string;
    type: string;
    status: "generating" | "ready" | "approved";
    preview?: string[];
  };
  tollgate?: {
    from: string;
    to: string;
    status: "checking" | "passed" | "failed";
    criteria?: string[];
  };
  handoff?: {
    from: string;
    to: string;
    artifact: string;
  };
  isStreaming?: boolean;
}

type RoleStatus = "idle" | "thinking" | "working" | "done";

// ─── Stage accents ───────────────────────────────────────────
const stageAccents: Record<number, string> = {
  1: "#4361ee",
  2: "#f59e0b",
  3: "#7b2ff7",
  4: "#00d4ff",
  5: "#00c896",
};

// ─── The demo conversation script ───────────────────────────
// This simulates a real enterprise user interacting with the team
function useDemoConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roleStatuses, setRoleStatuses] = useState<Record<string, RoleStatus>>({});
  const [step, setStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [userCanType, setUserCanType] = useState(true);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const setRoleStatus = useCallback((roleId: string, status: RoleStatus) => {
    setRoleStatuses((prev) => ({ ...prev, [roleId]: status }));
  }, []);

  const script: {
    delay: number;
    action: () => void;
  }[] = [
    // User asks — Requirements Dev picks up
    {
      delay: 0,
      action: () => {
        setUserCanType(false);
        setRoleStatus("lumi-requirements-dev", "thinking");
      },
    },
    // Requirements Dev responds
    {
      delay: 1200,
      action: () => {
        setRoleStatus("lumi-requirements-dev", "working");
        addMessage({
          id: "a1",
          type: "agent",
          role: "Requirements Dev",
          roleIcon: "FileText",
          roleColor: stageAccents[1],
          content:
            "Analyzing the Columbus district onboarding. Detecting 5 core data entities: bus_fleet, driver_roster, student_riders, route_stops, and district_contracts. Cross-referencing FMCSA compliance requirements and Ohio DOT school bus inspection standards. Mapping dependencies across First Student Cincinnati ops center and Columbus City Schools.",
          timestamp: "09:01",
        });
      },
    },
    // Requirements Dev artifact
    {
      delay: 2200,
      action: () => {
        addMessage({
          id: "a2",
          type: "artifact",
          role: "Requirements Dev",
          roleIcon: "FileText",
          roleColor: stageAccents[1],
          content: "",
          timestamp: "09:02",
          artifact: {
            title: "Requirements Spec — Columbus District Onboarding",
            type: "requirements_spec",
            status: "ready",
            preview: [
              "5 entities: bus_fleet, driver_roster, student_riders, route_stops, district_contracts",
              "28 fields requiring validation — 12 safety-critical (FMCSA)",
              "GPS telemetry feed from 340 buses + Zonar integration",
              "PostGIS required: route geometries, school zone polygons, stop radii",
              "Compliance: FMCSA, Ohio DOT Title 49, FERPA student data, ADA accessibility",
            ],
          },
        });
        setRoleStatus("lumi-requirements-dev", "done");
      },
    },
    // Handoff → Process Leader
    {
      delay: 1500,
      action: () => {
        addMessage({
          id: "h1",
          type: "handoff",
          content: "",
          timestamp: "09:02",
          handoff: {
            from: "Requirements Dev",
            to: "Process Leader",
            artifact: "requirements_spec",
          },
        });
        setRoleStatus("lumi-process-leader", "thinking");
      },
    },
    // Tollgate S1→S2
    {
      delay: 800,
      action: () => {
        addMessage({
          id: "t1",
          type: "tollgate",
          content: "",
          timestamp: "09:03",
          tollgate: {
            from: "Requirements",
            to: "Process",
            status: "checking",
            criteria: [
              "requirements_spec.status == approved",
              "data_sources.all_accessible == true",
              "stakeholder_sign_off == true",
            ],
          },
        });
      },
    },
    // Tollgate passes
    {
      delay: 1500,
      action: () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "t1" && m.tollgate
              ? { ...m, tollgate: { ...m.tollgate, status: "passed" as const } }
              : m
          )
        );
      },
    },
    // Process Leader responds
    {
      delay: 1000,
      action: () => {
        setRoleStatus("lumi-process-leader", "working");
        addMessage({
          id: "a3",
          type: "agent",
          role: "Process Leader",
          roleIcon: "ClipboardCheck",
          roleColor: stageAccents[2],
          content:
            "Building SOPs for Columbus district fleet onboarding. Identified 6 edge cases: CDL-B driver certification expiry mid-semester, substitute driver routing gaps, wheelchair lift buses exceeding 1:8 ratio requirement, Zonar GPS feed dropout during depot transitions, FERPA-protected student manifest sharing between dispatch centers, and electric bus cold-weather range degradation below 20\u00b0F.",
          timestamp: "09:04",
        });
      },
    },
    // Process Leader artifact
    {
      delay: 2400,
      action: () => {
        addMessage({
          id: "a3b",
          type: "artifact",
          role: "Process Leader",
          roleIcon: "ClipboardCheck",
          roleColor: stageAccents[2],
          content: "",
          timestamp: "09:05",
          artifact: {
            title: "SOP: District Fleet Onboarding — Columbus",
            type: "process_sops",
            status: "ready",
            preview: [
              "Step 1: Fleet intake — VIN validation + Ohio DOT inspection status",
              "Step 2: Driver assignment — CDL-B + school bus endorsement verification",
              "Step 3: Route optimization — stop sequencing within 45-min max ride time",
              "Step 4: Student manifest — FERPA-compliant data load from district SIS",
              "Step 5: GPS provisioning — Zonar device pairing per vehicle",
              "6 approval gates \u00b7 4 require district coordinator sign-off",
            ],
          },
        });
        setRoleStatus("lumi-process-leader", "done");
      },
    },
    // Handoff → Data Steward
    {
      delay: 1500,
      action: () => {
        addMessage({
          id: "h2",
          type: "handoff",
          content: "",
          timestamp: "09:05",
          handoff: {
            from: "Process Leader",
            to: "Data Steward",
            artifact: "process_sops",
          },
        });
        setRoleStatus("lumi-data-steward", "thinking");
      },
    },
    // Data Steward responds
    {
      delay: 1200,
      action: () => {
        setRoleStatus("lumi-data-steward", "working");
        addMessage({
          id: "a4",
          type: "agent",
          role: "Data Steward",
          roleIcon: "ShieldCheck",
          roleColor: stageAccents[3],
          content:
            "Running governance checks on fleet and student data schemas. Applying public transit vertical rules: vehicle_id must map to FMCSA registry, driver CDL-B must be non-expired with school bus endorsement (S/P), student PII must be FERPA-encrypted at rest, route_geometry must be valid PostGIS LineString within Franklin County boundary. Configuring RLS policies for district-level data isolation — Columbus data invisible to other First Student contracts.",
          timestamp: "09:06",
        });
      },
    },
    // Data Steward quality report
    {
      delay: 2500,
      action: () => {
        addMessage({
          id: "a5",
          type: "artifact",
          role: "Data Steward",
          roleIcon: "ShieldCheck",
          roleColor: stageAccents[3],
          content: "",
          timestamp: "09:07",
          artifact: {
            title: "Data Quality Report — Fleet, Drivers & Students",
            type: "data_quality_report",
            status: "ready",
            preview: [
              "Overall quality score: 98.2%",
              "0 critical findings",
              "2 warnings: 14 buses pending Ohio DOT re-inspection, 3 drivers approaching CDL renewal",
              "FERPA compliance: 100% — student PII encrypted, no cross-district leakage",
              "RLS policies: 100% coverage (district-level isolation verified)",
              "Zonar GPS feed latency: within 15s SLA",
            ],
          },
        });
        setRoleStatus("lumi-data-steward", "done");
      },
    },
    // Tollgate S3→S4
    {
      delay: 1200,
      action: () => {
        addMessage({
          id: "t2",
          type: "tollgate",
          content: "",
          timestamp: "09:07",
          tollgate: {
            from: "Governance",
            to: "Engineering",
            status: "checking",
            criteria: [
              "quality_report.overall_score >= 95",
              "quality_report.critical_findings == 0",
              "ferpa_compliance == 100%",
              "rls_policies.coverage == 100%",
            ],
          },
        });
      },
    },
    // Tollgate passes
    {
      delay: 1500,
      action: () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "t2" && m.tollgate
              ? { ...m, tollgate: { ...m.tollgate, status: "passed" as const } }
              : m
          )
        );
        setRoleStatus("lumi-agent-engineer", "thinking");
      },
    },
    // Agent Engineer responds
    {
      delay: 1000,
      action: () => {
        setRoleStatus("lumi-agent-engineer", "working");
        addMessage({
          id: "a6",
          type: "agent",
          role: "Agent Engineer",
          roleIcon: "Cpu",
          roleColor: stageAccents[4],
          content:
            "Building the district onboarding agent. Using approved fleet schema + FERPA governance rules from Data Steward and district SOPs from Process Leader. Generating CrewAI task definition with Supabase MCP connections for bus_fleet, driver_roster, and student_riders tables. Wiring Zonar GPS telemetry feed via MCP transport adapter. Route optimization sub-agent configured for 45-min max ride constraint.",
          timestamp: "09:08",
        });
      },
    },
    // Agent Ops picks up
    {
      delay: 2000,
      action: () => {
        setRoleStatus("lumi-agent-engineer", "done");
        addMessage({
          id: "h3",
          type: "handoff",
          content: "",
          timestamp: "09:09",
          handoff: {
            from: "Agent Engineer",
            to: "Agent Ops Engineer",
            artifact: "agent_package",
          },
        });
        setRoleStatus("lumi-agent-ops", "thinking");
      },
    },
    {
      delay: 1200,
      action: () => {
        setRoleStatus("lumi-agent-ops", "working");
        addMessage({
          id: "a7",
          type: "agent",
          role: "Agent Ops Engineer",
          roleIcon: "Activity",
          roleColor: stageAccents[5],
          content:
            "Deploying to production. Monitoring pipeline active: Zonar GPS feed health across 340 buses, driver CDL expiry watchdog, student manifest FERPA audit trail, route deviation alerts (> 0.5mi off-route triggers dispatch notification). Langfuse observability configured. Escalation set to #columbus-ops Slack channel. Daily summary report auto-sent to Columbus City Schools transportation office at 6:00 AM EST.",
          timestamp: "09:10",
        });
      },
    },
    // Final system message
    {
      delay: 2000,
      action: () => {
        setRoleStatus("lumi-agent-ops", "done");
        addMessage({
          id: "s1",
          type: "system",
          content:
            "Pipeline complete — 5 roles coordinated across 4 tollgates, 5 artifacts generated. The Columbus district onboarding agent is live and monitored. 340 buses, 280 drivers, 12,400 students now managed. First Student ops and Columbus City Schools will receive real-time alerts.",
          timestamp: "09:11",
        });
        setUserCanType(true);
        setIsRunning(false);
      },
    },
  ];

  const startDemo = useCallback(
    (userMessage: string) => {
      if (isRunning) return;
      setIsRunning(true);
      setMessages([
        {
          id: "u1",
          type: "user",
          content: userMessage,
          timestamp: "12:00",
        },
      ]);
      setRoleStatuses({});
      setStep(0);
    },
    [isRunning]
  );

  useEffect(() => {
    if (step < 0 || step >= script.length) return;
    const timer = setTimeout(() => {
      script[step].action();
      setStep((s) => s + 1);
    }, script[step].delay);
    return () => clearTimeout(timer);
  }, [step]);

  return { messages, roleStatuses, startDemo, isRunning, userCanType };
}

// ─── Message Components ─────────────────────────────────────

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex justify-end"
    >
      <div className="max-w-[70%] flex items-start gap-3">
        <div className="glass-card px-5 py-3.5 bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-blue)]/10">
          <p className="text-sm text-white/80 leading-relaxed">{msg.content}</p>
          <div className="text-[10px] text-white/20 mt-2 text-right font-mono">
            {msg.timestamp}
          </div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
          <User size={14} className="text-white/40" />
        </div>
      </div>
    </motion.div>
  );
}

function AgentMessage({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-start"
    >
      <div className="max-w-[75%] flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${msg.roleColor}18`, border: `1px solid ${msg.roleColor}30` }}
        >
          <RoleIcon name={msg.roleIcon || "Bot"} size={14} />
        </motion.div>
        <div className="glass-subtle px-5 py-3.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold" style={{ color: msg.roleColor }}>
              {msg.role}
            </span>
            <span className="text-[10px] text-white/15 font-mono">{msg.timestamp}</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{msg.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ArtifactMessage({ msg }: { msg: ChatMessage }) {
  if (!msg.artifact) return null;
  const a = msg.artifact;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-start pl-11"
    >
      <div className="max-w-[75%]">
        <div
          className="glass-card px-5 py-4 relative overflow-hidden"
          style={{ borderColor: `${msg.roleColor}25` }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: msg.roleColor }} />
            <span className="text-xs font-semibold text-white/70">{a.title}</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{
                color: a.status === "ready" ? "#00c896" : msg.roleColor,
                background: a.status === "ready" ? "rgba(0,200,150,0.1)" : `${msg.roleColor}10`,
                border: `1px solid ${a.status === "ready" ? "rgba(0,200,150,0.2)" : `${msg.roleColor}20`}`,
              }}
            >
              {a.status === "ready" && <CheckCircle2 size={8} />}
              {a.status}
            </motion.span>
          </div>

          {a.preview && (
            <div className="space-y-1.5 font-mono text-[11px]">
              {a.preview.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-white/40 flex items-start gap-2"
                >
                  <ChevronRight size={10} className="mt-0.5 shrink-0" style={{ color: msg.roleColor }} />
                  <span>{line}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TollgateMessage({ msg }: { msg: ChatMessage }) {
  if (!msg.tollgate) return null;
  const t = msg.tollgate;
  const isPassed = t.status === "passed";
  const isChecking = t.status === "checking";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center my-2"
    >
      <div
        className="glass-card px-5 py-3 max-w-md w-full relative overflow-hidden"
        style={{
          borderColor: isPassed ? "rgba(0,200,150,0.2)" : isChecking ? "rgba(123,47,247,0.2)" : "rgba(230,57,70,0.2)",
        }}
      >
        {isChecking && <div className="scan-line" style={{ animationDuration: "2s" }} />}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield
              size={14}
              className={isPassed ? "text-[var(--accent-green)]" : isChecking ? "text-[var(--accent-purple)]" : "text-red-400"}
            />
            <span className="text-xs font-semibold text-white/60">
              Arc Tollgate · {t.from} → {t.to}
            </span>
          </div>
          <motion.span
            animate={
              isChecking
                ? { opacity: [1, 0.4, 1] }
                : {}
            }
            transition={{ duration: 1, repeat: isChecking ? Infinity : 0 }}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isPassed
                ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20"
                : isChecking
                  ? "text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20"
                  : "text-red-400 bg-red-400/10 border border-red-400/20"
            }`}
          >
            {isChecking && <Loader2 size={8} className="animate-spin" />}
            {isPassed && <CheckCircle2 size={8} />}
            {t.status}
          </motion.span>
        </div>

        {t.criteria && (
          <div className="space-y-1 font-mono text-[10px]">
            {t.criteria.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-2 text-white/30"
              >
                {isPassed ? (
                  <CheckCircle2 size={9} className="text-[var(--accent-green)] shrink-0" />
                ) : isChecking ? (
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-[var(--accent-purple)] shrink-0"
                  />
                ) : (
                  <XCircle size={9} className="text-red-400 shrink-0" />
                )}
                <span>{c}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HandoffMessage({ msg }: { msg: ChatMessage }) {
  if (!msg.handoff) return null;
  const h = msg.handoff;
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      className="flex justify-center my-1"
    >
      <div className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono text-white/25">
        <span>{h.from}</span>
        <motion.div
          className="flex items-center gap-1"
          initial={{ width: 0 }}
          animate={{ width: "auto" }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)]" />
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={10} className="text-[var(--accent-cyan)]" />
          </motion.div>
          <div className="w-8 h-px bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-green)]" />
        </motion.div>
        <span>{h.to}</span>
        <span className="text-white/15">· {h.artifact}</span>
      </div>
    </motion.div>
  );
}

function SystemMessage({ msg }: { msg: ChatMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center my-3"
    >
      <div className="glass-card px-5 py-3 max-w-lg text-center bg-gradient-to-r from-[var(--accent-green)]/5 to-[var(--accent-cyan)]/5 border-[var(--accent-green)]/15">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle2 size={14} className="text-[var(--accent-green)]" />
          <span className="text-xs font-semibold text-[var(--accent-green)]">Pipeline Complete</span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">{msg.content}</p>
      </div>
    </motion.div>
  );
}

// ─── Thinking Indicator ─────────────────────────────────────
function ThinkingIndicator({ role, color, icon }: { role: string; color: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-start gap-3 pl-0"
    >
      <motion.div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <RoleIcon name={icon} size={14} />
      </motion.div>
      <div className="glass-subtle px-4 py-2.5 flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color }}>
          {role}
        </span>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Role Sidebar ────────────────────────────────────────────
function RoleSidebar({
  selectedRoles,
  roleStatuses,
}: {
  selectedRoles: typeof ROLES;
  roleStatuses: Record<string, RoleStatus>;
}) {
  return (
    <div className="w-56 shrink-0 space-y-2">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Bot size={13} className="text-[var(--accent-purple)]" />
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          Agent Team
        </span>
      </div>
      {selectedRoles.map((role, i) => {
        const accent = stageAccents[role.stage_order] || "#7b2ff7";
        const status = roleStatuses[role.role_id] || "idle";
        return (
          <motion.div
            key={role.role_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`glass-subtle px-3 py-2.5 flex items-center gap-2.5 transition-all ${
              status === "working" || status === "thinking" ? "border-l-2" : ""
            }`}
            style={{
              borderLeftColor: status === "working" || status === "thinking" ? accent : "transparent",
              background: status === "working" ? `${accent}08` : undefined,
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accent}12` }}
            >
              <RoleIcon name={role.icon} size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white/60 truncate">
                {role.display_name}
              </div>
              <div className="text-[9px] text-white/20 font-mono">S{role.stage_order}</div>
            </div>
            <div className="shrink-0">
              {status === "idle" && (
                <div className="w-2 h-2 rounded-full bg-white/10" />
              )}
              {status === "thinking" && (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: accent }}
                />
              )}
              {status === "working" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={12} style={{ color: accent }} />
                </motion.div>
              )}
              {status === "done" && (
                <CheckCircle2 size={12} className="text-[var(--accent-green)]" />
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Protocol badges */}
      <div className="mt-6 space-y-2 px-1">
        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
          Protocols
        </div>
        <div className="flex gap-2">
          {["MCP", "A2A"].map((p) => (
            <div
              key={p}
              className="text-[9px] font-mono text-white/25 bg-white/[0.02] border border-white/[0.04] px-2 py-1 rounded-md"
            >
              {p}
            </div>
          ))}
        </div>
        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-3">
          Governance
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-red-400/50">
          <Shield size={10} />
          <span className="font-mono">Enforced</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Workspace View ─────────────────────────────────────
export function WorkspaceView() {
  const { state } = useTeam();
  const selectedRoles = ROLES.filter((r) =>
    state.selectedRoles.includes(r.role_id)
  ).sort((a, b) => a.stage_order - b.stage_order);

  const { messages, roleStatuses, startDemo, isRunning, userCanType } =
    useDemoConversation();
  const [inputValue, setInputValue] = useState(
    "We just won the Columbus City Schools contract — 340 buses, 280 drivers, 12,400 students. Need to onboard the full fleet, validate every CDL, load student manifests FERPA-compliant, and go live before fall semester"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, roleStatuses]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || isRunning) return;
    startDemo(inputValue);
    setInputValue("");
  }

  // Find currently active role for thinking indicator
  const thinkingRole = selectedRoles.find(
    (r) => roleStatuses[r.role_id] === "thinking"
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Workflow size={14} className="text-[var(--accent-cyan)]" />
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
            End User Experience
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white/90">Workspace</h1>
        <p className="text-white/35 text-sm mt-1">
          One conversation. Five agents. 340 buses onboarded.
        </p>
      </motion.div>

      {/* Workspace Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-0 overflow-hidden flex"
        style={{ height: "calc(100vh - 220px)", minHeight: 500 }}
      >
        {/* Sidebar */}
        <div className="border-r border-white/[0.05] p-4 overflow-y-auto">
          <RoleSidebar selectedRoles={selectedRoles} roleStatuses={roleStatuses} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-purple)]/10 to-[var(--accent-cyan)]/10 border border-white/[0.06] flex items-center justify-center mx-auto">
                    <Sparkles size={24} className="text-white/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/40">
                      Your agent team is ready
                    </h3>
                    <p className="text-xs text-white/20 mt-1 max-w-xs mx-auto">
                      {selectedRoles.length} roles standing by. Describe what you need and they'll
                      coordinate through Arc tollgated workflows.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg) => {
                switch (msg.type) {
                  case "user":
                    return <UserMessage key={msg.id} msg={msg} />;
                  case "agent":
                    return <AgentMessage key={msg.id} msg={msg} />;
                  case "artifact":
                    return <ArtifactMessage key={msg.id} msg={msg} />;
                  case "tollgate":
                    return <TollgateMessage key={msg.id} msg={msg} />;
                  case "handoff":
                    return <HandoffMessage key={msg.id} msg={msg} />;
                  case "system":
                    return <SystemMessage key={msg.id} msg={msg} />;
                  default:
                    return null;
                }
              })}
            </AnimatePresence>

            {/* Thinking indicator */}
            <AnimatePresence>
              {thinkingRole && (
                <ThinkingIndicator
                  key={thinkingRole.role_id}
                  role={thinkingRole.display_name}
                  color={stageAccents[thinkingRole.stage_order] || "#7b2ff7"}
                  icon={thinkingRole.icon}
                />
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.05] p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe what you need..."
                  disabled={isRunning}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[var(--accent-purple)]/30 focus:bg-white/[0.04] transition-all disabled:opacity-40"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isRunning || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)]/30 flex items-center justify-center text-white/60 hover:text-white hover:bg-[var(--accent-purple)]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={16} />
              </motion.button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-white/15 font-mono">
                {selectedRoles.length} roles · {state.vertical} · {state.governanceMode} governance
              </span>
              {isRunning && (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[10px] text-[var(--accent-cyan)] font-mono flex items-center gap-1"
                >
                  <Activity size={10} />
                  Pipeline active
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
