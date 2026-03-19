"use client";

import { motion } from "framer-motion";
import { ROLES } from "@/lib/roles";
import { useTeam } from "@/lib/store";
import { RoleIcon } from "./RoleIcon";
import {
  CheckCircle2,
  Clock,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  CircleDollarSign,
  BarChart3,
  Gauge,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const stageAccents: Record<number, string> = {
  1: "#4361ee",
  2: "#7b2ff7",
  3: "#00d4ff",
  4: "#00c896",
  5: "#f59e0b",
};

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const initial = value;
    function update(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(initial + (target - initial) * eased));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target]);
  return value;
}

// Mini sparkline
function Sparkline({ data, color, width = 80, height = 24 }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="spark-pulse">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace("#","")})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Endpoint dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

// Simulated live data
function useSimulatedMetrics() {
  const [metrics, setMetrics] = useState({
    totalTokens: 124_580,
    totalCost: 12.47,
    avgQuality: 94.2,
    activeWorkflows: 3,
    tollgatesPassed: 7,
    tollgatesFailed: 1,
    tokenHistory: [80, 95, 88, 105, 110, 98, 115, 120, 125],
    qualityHistory: [91, 93, 92, 94, 95, 93, 94, 96, 94],
    costHistory: [5, 6.2, 7.1, 8, 9.2, 10, 10.8, 11.5, 12.5],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const newTokens = prev.totalTokens + Math.floor(Math.random() * 300 + 50);
        const newCost = +(prev.totalCost + Math.random() * 0.03).toFixed(2);
        const newQuality = +(92.5 + Math.random() * 5).toFixed(1);
        return {
          ...prev,
          totalTokens: newTokens,
          totalCost: newCost,
          avgQuality: newQuality,
          tokenHistory: [...prev.tokenHistory.slice(-11), newTokens / 1000],
          qualityHistory: [...prev.qualityHistory.slice(-11), newQuality],
          costHistory: [...prev.costHistory.slice(-11), newCost],
        };
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
  delay,
  sparkData,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  accent: string;
  delay: number;
  sparkData: number[];
}) {
  const animated = useAnimatedCounter(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-20"
        style={{ background: accent }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${accent}15` }}
            >
              <Icon size={15} className="opacity-80" />
            </div>
            <span className="text-[10px] text-white/35 uppercase tracking-wider font-mono">
              {label}
            </span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white/90 tabular-nums">
            {suffix === "$" ? "$" : ""}
            {animated.toLocaleString()}
            {suffix === "%" ? "%" : ""}
          </div>
          <Sparkline data={sparkData} color={accent} />
        </div>
      </div>
    </motion.div>
  );
}

function getRoleStatus(stageOrder: number) {
  if (stageOrder <= 2) return { status: "complete", label: "Complete", color: "#00c896" };
  if (stageOrder === 3) return { status: "running", label: "Running", color: "#00d4ff" };
  return { status: "pending", label: "Queued", color: "#ffffff30" };
}

export function CockpitView() {
  const { state } = useTeam();
  const metrics = useSimulatedMetrics();
  const selectedRoles = ROLES.filter((r) =>
    state.selectedRoles.includes(r.role_id)
  ).sort((a, b) => a.stage_order - b.stage_order);

  const logs = useMemo(() => [
    { time: "12:04:23", msg: "Data Steward completed quality audit — score 96.3%", type: "success" },
    { time: "12:03:58", msg: "Tollgate S2→S3 passed (enforced mode)", type: "tollgate" },
    { time: "12:02:11", msg: "Agent Engineer started build phase", type: "info" },
    { time: "12:01:45", msg: "Schema validation: 0 breaking changes detected", type: "success" },
    { time: "12:00:30", msg: "Requirements spec approved — 14 entities identified", type: "success" },
    { time: "11:59:12", msg: "Tollgate S1→S2 passed (enforced mode)", type: "tollgate" },
    { time: "11:58:00", msg: "Requirements Dev completed stakeholder analysis", type: "info" },
    { time: "11:56:22", msg: "MCP connection established: supabase-governance", type: "info" },
    { time: "11:55:01", msg: "A2A agent handoff initialized for 4 roles", type: "info" },
  ], []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={14} className="text-[var(--accent-cyan)]" />
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
              Live Monitoring
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white/90">Cockpit</h1>
        </div>
        <motion.div
          animate={{ boxShadow: ["0 0 0px rgba(0,200,150,0)", "0 0 15px rgba(0,200,150,0.3)", "0 0 0px rgba(0,200,150,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 glass-subtle px-4 py-2.5"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] pulse-dot" />
          <span className="text-sm text-white/50 font-mono">
            {metrics.activeWorkflows} Active
          </span>
        </motion.div>
      </motion.div>

      {/* Metrics Grid — Quality gauge prominent */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Quality Gauge — spans 1 col but visually dominant */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-card p-6 relative overflow-hidden flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-green)]/5 to-transparent" />
          <div className="relative z-10 text-center">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
              Quality Score
            </div>
            <motion.div
              className="text-5xl font-bold tabular-nums"
              style={{ color: "var(--accent-green)" }}
              animate={{ textShadow: ["0 0 0px rgba(0,200,150,0)", "0 0 20px rgba(0,200,150,0.4)", "0 0 0px rgba(0,200,150,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {metrics.avgQuality.toFixed(1)}%
            </motion.div>
            <Sparkline data={metrics.qualityHistory} color="#00c896" width={100} height={20} />
            <div className="text-[10px] text-white/20 mt-1">
              Trending up · all tollgates passing
            </div>
          </div>
        </motion.div>

        <MetricCard
          icon={Zap}
          label="Total Tokens"
          value={metrics.totalTokens}
          accent="#7b2ff7"
          delay={0.15}
          sparkData={metrics.tokenHistory}
        />
        <MetricCard
          icon={CircleDollarSign}
          label="Token Spend"
          value={Math.floor(metrics.totalCost * 100) / 100}
          suffix="$"
          accent="#f59e0b"
          delay={0.2}
          sparkData={metrics.costHistory}
        />
        <MetricCard
          icon={Shield}
          label="Tollgates Passed"
          value={metrics.tollgatesPassed}
          accent="#4361ee"
          delay={0.25}
          sparkData={[5, 5, 6, 6, 7, 7, 7, 7, 7]}
        />
      </div>

      {/* Pipeline Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="scan-line" style={{ animationDuration: "6s" }} />

        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={14} className="text-[var(--accent-purple)]" />
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Pipeline Status
          </h2>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-4 px-4 mb-2">
          <div className="w-8" />
          <div className="w-10" />
          <div className="flex-1 text-[9px] font-mono text-white/20 uppercase tracking-wider">Role</div>
          <div className="w-16 text-right text-[9px] font-mono text-white/20 uppercase tracking-wider">Tokens</div>
          <div className="w-14 text-right text-[9px] font-mono text-white/20 uppercase tracking-wider">Quality</div>
          <div className="w-16 text-right text-[9px] font-mono text-white/20 uppercase tracking-wider">Cost</div>
          <div className="w-20 text-right text-[9px] font-mono text-white/20 uppercase tracking-wider">LLM</div>
        </div>

        <div className="space-y-3">
          {selectedRoles.map((role, i) => {
            const accent = stageAccents[role.stage_order] || "#7b2ff7";
            const status = getRoleStatus(role.stage_order);
            const tokenSpend = Math.floor(20000 + Math.random() * 40000);
            const quality = Math.floor(88 + Math.random() * 12);
            const llmModels: Record<number, string> = { 1: "Opus", 2: "Sonnet", 3: "Sonnet", 4: "Opus", 5: "Haiku" };
            const llm = llmModels[role.stage_order] || "Sonnet";

            return (
              <motion.div
                key={role.role_id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4 + i * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
                className="glass-subtle p-4 flex items-center gap-4 transition-colors"
              >
                {/* Status */}
                <div className="w-8 flex justify-center">
                  {status.status === "complete" && (
                    <CheckCircle2 size={18} style={{ color: status.color }} />
                  )}
                  {status.status === "running" && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Activity size={18} style={{ color: status.color }} />
                    </motion.div>
                  )}
                  {status.status === "pending" && (
                    <Clock size={18} className="text-white/15" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${accent}12` }}
                >
                  <RoleIcon name={role.icon} size={18} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white/80 text-sm">
                      {role.display_name}
                    </span>
                    <motion.span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        color: status.color,
                        background: `${status.color}12`,
                        border: `1px solid ${status.color}25`,
                      }}
                      animate={
                        status.status === "running"
                          ? { borderColor: [`${status.color}25`, `${status.color}60`, `${status.color}25`] }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {status.label}
                    </motion.span>
                  </div>
                  <div className="text-[10px] text-white/20 font-mono mt-0.5">
                    S{role.stage_order} · {role.stage_name}
                  </div>
                </div>

                {/* Per-role metrics */}
                <div className="flex items-center gap-0 text-xs text-white/30">
                  <div className="text-right w-16">
                    <div className="text-white/50 font-mono tabular-nums">
                      {tokenSpend.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right w-14">
                    <div className="text-white/50 font-mono tabular-nums">{quality}%</div>
                  </div>
                  <div className="text-right w-16">
                    <div className="text-[var(--accent-amber)] font-mono tabular-nums font-semibold">
                      ${(tokenSpend * 0.00015).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right w-20">
                    <div className="text-white/30 font-mono tabular-nums text-[10px]">
                      {llm}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Activity Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-[var(--accent-cyan)]" />
          <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Activity Stream
          </h2>
          <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] pulse-dot" />
            live
          </div>
        </div>
        <div className="space-y-2 font-mono text-xs">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <span className="text-white/15 shrink-0 tabular-nums">{log.time}</span>
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  log.type === "success"
                    ? "bg-[var(--accent-green)]"
                    : log.type === "tollgate"
                      ? "bg-[var(--accent-purple)]"
                      : "bg-[var(--accent-cyan)]"
                }`}
              />
              <span
                className={
                  log.type === "success"
                    ? "text-green-400/50"
                    : log.type === "tollgate"
                      ? "text-purple-400/50"
                      : "text-cyan-400/40"
                }
              >
                {log.msg}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
