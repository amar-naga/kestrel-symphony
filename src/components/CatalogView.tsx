"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ROLES } from "@/lib/roles";
import { useTeam } from "@/lib/store";
import { RoleIcon } from "./RoleIcon";
import { Check, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useRef } from "react";

const stageColors: Record<number, string> = {
  1: "from-blue-500/20 to-blue-600/5",
  2: "from-amber-500/20 to-amber-600/5",
  3: "from-purple-500/20 to-purple-600/5",
  4: "from-cyan-500/20 to-cyan-600/5",
  5: "from-green-500/20 to-green-600/5",
};

const stageAccents: Record<number, string> = {
  1: "#4361ee",
  2: "#f59e0b",
  3: "#7b2ff7",
  4: "#00d4ff",
  5: "#00c896",
};

const stageBadges: Record<number, string> = {
  1: "Requirements",
  2: "Process",
  3: "Governance",
  4: "Engineering",
  5: "Operations",
};

function GlassCard({
  role,
  isSelected,
  onToggle,
  index,
}: {
  role: (typeof ROLES)[0];
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const accent = stageAccents[role.stage_order];

  const spotlightX = useTransform(mouseX, (v) => `${v}px`);
  const spotlightY = useTransform(mouseY, (v) => `${v}px`);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      onMouseMove={handleMouseMove}
      className="cursor-pointer group relative"
    >
      <div
        className={`glass-card shimmer-effect prismatic-edge p-6 h-full flex flex-col relative overflow-hidden ${
          isSelected ? "animated-border" : ""
        }`}
        style={{
          boxShadow: isSelected
            ? `0 0 60px ${accent}40, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
            : undefined,
        }}
      >
        {/* Mouse spotlight effect */}
        <motion.div
          className="absolute pointer-events-none z-[1] rounded-full"
          style={{
            left: spotlightX,
            top: spotlightY,
            width: 200,
            height: 200,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
        />

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
            style={{ background: accent, boxShadow: `0 0 20px ${accent}60` }}
          >
            <Check size={14} className="text-white" strokeWidth={3} />
          </motion.div>
        )}

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stageColors[role.stage_order]} opacity-60 rounded-[24px] transition-opacity group-hover:opacity-80`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Stage badge */}
          <motion.div
            className="flex items-center gap-2 mb-5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.12 }}
          >
            <span
              className="text-lg font-bold font-mono leading-none"
              style={{ color: accent }}
            >
              {role.stage_order}
            </span>
            <div className="flex flex-col">
              <span
                className="text-[9px] font-mono uppercase tracking-widest leading-none"
                style={{ color: `${accent}99` }}
              >
                Stage
              </span>
              <span className="text-[10px] text-white/25 font-mono leading-tight">
                {stageBadges[role.stage_order]}
              </span>
            </div>
          </motion.div>

          {/* Icon with glow */}
          <div className="relative mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: `${accent}12` }}
            >
              <RoleIcon name={role.icon} size={26} className="opacity-80" />
            </div>
            {/* Icon glow on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
              style={{ background: `${accent}20` }}
            />
          </div>

          {/* Name & tagline */}
          <h3 className="text-xl font-semibold text-white/90 mb-2 group-hover:text-white transition-colors">
            {role.display_name}
          </h3>
          <p className="text-sm text-white/35 mb-5 flex-1 leading-relaxed group-hover:text-white/50 transition-colors">
            {role.tagline}
          </p>

          {/* Capabilities */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {role.capabilities.commands.map((cmd) => (
                <span
                  key={cmd}
                  className="text-[11px] font-mono text-white/25 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.04] group-hover:text-white/40 group-hover:border-white/[0.08] transition-all"
                >
                  {cmd}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-white/20">
                <Sparkles size={10} />
                <span>
                  {role.capabilities.skills.length} skills ·{" "}
                  {role.capabilities.agents.length} agents
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white/15">
                <Zap size={8} />
                <span>{role.verticals.length} verticals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CatalogView() {
  const { state, dispatch } = useTeam();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-[var(--accent-purple)]"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em]">
              Select Your Team
            </span>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-[var(--accent-purple)]"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Agent Role Catalog
          </h1>
          <p className="text-white/35 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
            Each role is a standalone AI specialist. Select roles to compose
            your team, then wire them through Arc tollgated workflows.
          </p>
        </motion.div>
      </div>

      {/* Solution Packs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-3"
      >
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider mr-1">
          Quick Select
        </span>
        {[
          {
            label: "Public Transit Pack",
            desc: "All 5 roles",
            roles: ROLES.map((r) => r.role_id),
            color: "#06b6d4",
          },
          {
            label: "Governance Only",
            desc: "3 roles",
            roles: ["lumi-requirements-dev", "lumi-process-leader", "lumi-data-steward"],
            color: "#7b2ff7",
          },
          {
            label: "Build & Deploy",
            desc: "2 roles",
            roles: ["lumi-agent-engineer", "lumi-agent-ops"],
            color: "#00c896",
          },
        ].map((pack) => {
          const allSelected = pack.roles.every((r) =>
            state.selectedRoles.includes(r)
          );
          return (
            <motion.button
              key={pack.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                pack.roles.forEach((roleId) => {
                  const isSelected = state.selectedRoles.includes(roleId);
                  if (allSelected) {
                    if (isSelected) dispatch({ type: "TOGGLE_ROLE", roleId });
                  } else {
                    if (!isSelected) dispatch({ type: "TOGGLE_ROLE", roleId });
                  }
                });
              }}
              className="glass-subtle px-4 py-2 flex items-center gap-2 cursor-pointer transition-all"
              style={{
                borderColor: allSelected ? `${pack.color}30` : undefined,
                background: allSelected ? `${pack.color}08` : undefined,
              }}
            >
              {allSelected && (
                <Check size={10} style={{ color: pack.color }} />
              )}
              <span className="text-xs font-medium text-white/50">
                {pack.label}
              </span>
              <span className="text-[10px] text-white/20">{pack.desc}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-[1400px] mx-auto">
        {ROLES.map((role, i) => (
          <GlassCard
            key={role.role_id}
            role={role}
            isSelected={state.selectedRoles.includes(role.role_id)}
            onToggle={() =>
              dispatch({ type: "TOGGLE_ROLE", roleId: role.role_id })
            }
            index={i}
          />
        ))}
      </div>

      {/* Compose CTA */}
      {state.selectedRoles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "SET_VIEW", view: "composer" })}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="relative glass-card px-8 py-4 flex items-center gap-3 text-white">
              <span className="font-semibold">
                Compose Team with {state.selectedRoles.length} Role
                {state.selectedRoles.length > 1 ? "s" : ""}
              </span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
