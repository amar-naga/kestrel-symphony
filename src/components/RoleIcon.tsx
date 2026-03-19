"use client";

import {
  FileText,
  ShieldCheck,
  Cpu,
  Activity,
  Building2,
  Heart,
  Landmark,
  HandCoins,
  ClipboardCheck,
  Bus,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  FileText,
  ShieldCheck,
  Cpu,
  Activity,
  Building2,
  Heart,
  Landmark,
  HandCoins,
  ClipboardCheck,
  Bus,
};

export function RoleIcon({
  name,
  className,
  size = 24,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} size={size} />;
}
