export interface RoleCard {
  role_id: string;
  display_name: string;
  tagline: string;
  category: string;
  icon: string;
  tier: "core" | "specialized" | "custom";
  stage_order: number;
  stage_name: string;
  capabilities: {
    skills: string[];
    agents: string[];
    commands: string[];
  };
  verticals: string[];
  receives_from: { role: string; artifact: string }[];
  delivers_to: { role: string; artifact: string }[];
}

// Roles derived from the ROLE_CARD.yaml spec and CLAUDE.md architecture
export const ROLES: RoleCard[] = [
  {
    role_id: "lumi-requirements-dev",
    display_name: "Requirements Dev",
    tagline: "Translates business needs into structured agent requirements",
    category: "planning",
    icon: "FileText",
    tier: "core",
    stage_order: 1,
    stage_name: "requirements_gathering",
    capabilities: {
      skills: ["requirements-analysis", "stakeholder-mapping"],
      agents: ["requirement-parser"],
      commands: ["/requirements", "/stakeholders", "/scope"],
    },
    verticals: ["real_estate", "healthcare", "financial_services"],
    receives_from: [],
    delivers_to: [
      { role: "lumi-data-steward", artifact: "requirements_spec" },
      { role: "lumi-agent-engineer", artifact: "agent_requirements" },
    ],
  },
  {
    role_id: "lumi-process-leader",
    display_name: "Process Leader",
    tagline: "Builds SOPs, edge cases, and approval gates with your functional experts",
    category: "process",
    icon: "ClipboardCheck",
    tier: "core",
    stage_order: 2,
    stage_name: "process_design",
    capabilities: {
      skills: ["sop-builder", "edge-case-analysis"],
      agents: ["process-mapper", "approval-designer"],
      commands: ["/sop", "/gates", "/edge-cases"],
    },
    verticals: ["real_estate", "healthcare", "financial_services"],
    receives_from: [
      { role: "lumi-requirements-dev", artifact: "requirements_spec" },
    ],
    delivers_to: [
      { role: "lumi-data-steward", artifact: "process_sops" },
      { role: "lumi-agent-engineer", artifact: "approval_gates" },
    ],
  },
  {
    role_id: "lumi-data-steward",
    display_name: "Data Steward",
    tagline: "Defines source-of-truth rules, quality constraints, and data access",
    category: "governance",
    icon: "ShieldCheck",
    tier: "core",
    stage_order: 3,
    stage_name: "data_validation",
    capabilities: {
      skills: ["data-governance", "schema-validation"],
      agents: ["quality-checker"],
      commands: ["/audit", "/lineage", "/govern"],
    },
    verticals: ["real_estate", "healthcare", "financial_services"],
    receives_from: [
      { role: "lumi-requirements-dev", artifact: "requirements_spec" },
    ],
    delivers_to: [
      { role: "lumi-agent-engineer", artifact: "data_quality_report" },
      { role: "lumi-agent-ops", artifact: "governance_policies" },
    ],
  },
  {
    role_id: "lumi-agent-engineer",
    display_name: "Agent Engineer",
    tagline: "Builds, tests, and validates agent implementations",
    category: "engineering",
    icon: "Cpu",
    tier: "core",
    stage_order: 4,
    stage_name: "agent_build",
    capabilities: {
      skills: ["agent-development", "testing-harness"],
      agents: ["code-reviewer", "test-runner"],
      commands: ["/build", "/test", "/validate"],
    },
    verticals: ["real_estate", "healthcare", "financial_services"],
    receives_from: [
      { role: "lumi-requirements-dev", artifact: "agent_requirements" },
      { role: "lumi-data-steward", artifact: "data_quality_report" },
    ],
    delivers_to: [
      { role: "lumi-agent-ops", artifact: "agent_package" },
    ],
  },
  {
    role_id: "lumi-agent-ops",
    display_name: "Agent Ops Engineer",
    tagline: "Deploys, monitors, and manages agents in production",
    category: "operations",
    icon: "Activity",
    tier: "core",
    stage_order: 5,
    stage_name: "deployment_ops",
    capabilities: {
      skills: ["deployment-pipeline", "monitoring-setup"],
      agents: ["health-monitor", "cost-tracker"],
      commands: ["/deploy", "/monitor", "/rollback"],
    },
    verticals: ["real_estate", "healthcare", "financial_services"],
    receives_from: [
      { role: "lumi-agent-engineer", artifact: "agent_package" },
      { role: "lumi-data-steward", artifact: "governance_policies" },
    ],
    delivers_to: [],
  },
];

export const VERTICALS = [
  { id: "real_estate", label: "Real Estate", icon: "Building2", color: "#e63946" },
  { id: "healthcare", label: "Healthcare", icon: "Heart", color: "#00c896" },
  { id: "financial_services", label: "Financial Services", icon: "Landmark", color: "#4361ee" },
  { id: "lending", label: "Lending", icon: "HandCoins", color: "#f59e0b" },
  { id: "public_transportation", label: "Public Transit", icon: "Bus", color: "#06b6d4" },
] as const;

export const ENGINES = [
  {
    id: "crewai",
    name: "CrewAI",
    description: "Role-based agent teams with built-in delegation",
    pros: ["Native role support", "Built-in memory", "Easy debugging"],
    cons: ["Less flexible graph structures"],
  },
  {
    id: "langgraph",
    name: "LangGraph",
    description: "Graph-based agent orchestration with state machines",
    pros: ["Fine-grained control", "State persistence", "Conditional routing"],
    cons: ["More complex setup", "Steeper learning curve"],
  },
  {
    id: "autogen",
    name: "AutoGen",
    description: "Microsoft's multi-agent conversation framework",
    pros: ["Conversation patterns", "Code execution", "Group chat"],
    cons: ["Less structured workflows", "Newer ecosystem"],
  },
] as const;
