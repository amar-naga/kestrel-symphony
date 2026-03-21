"use client";

import { createContext, useContext } from "react";

/* ================================================================
   TYPES
   ================================================================ */

export type View = "hero" | "board" | "blueprint" | "session" | "tollgate" | "cockpit";
export type GovernanceMode = "advisory" | "enforced";

export type StoryType = "feature" | "bug" | "spike" | "epic";
export type StoryPriority = "critical" | "high" | "medium" | "low";
export type StoryStatus = "backlog" | "ready" | "in_symphony" | "done";
export type PhaseId = "plan" | "design" | "build" | "deploy";
export type PhaseStatus = "pending" | "active" | "passed" | "failed" | "skipped";
export type HumanMode = "collaborative" | "review" | "delegated";

/* ── Jira Stories ─────────────────────────────────────────── */

export interface JiraStory {
  id: string;
  key: string;
  title: string;
  description: string;
  type: StoryType;
  priority: StoryPriority;
  status: StoryStatus;
  assignee?: string;
  component: string;
  epicKey?: string;
  storyPoints?: number;
  labels: string[];
  // Symphony enrichment
  blueprint?: Blueprint;
  phases?: PhaseState[];
  startedAt?: string;
  completedAt?: string;
}

/* ── Blueprint ────────────────────────────────────────────── */

export interface BlueprintPhase {
  id: PhaseId;
  name: string;
  roles: string[];
  tools: string[];
  humanMode: HumanMode;
  estimatedMinutes: number;
  estimatedCost: number;
}

export interface Blueprint {
  storyId: string;
  reasoning: string; // the "why" — Knowledge Layer insight
  phases: BlueprintPhase[];
  totalEstimatedCost: number;
  totalEstimatedMinutes: number;
  historicalComparison: {
    avgDevHours: number;
    avgCost: number;
    similarStories: string[];
  };
  approved: boolean;
}

/* ── Phase Execution ──────────────────────────────────────── */

export interface PhaseState {
  id: PhaseId;
  name: string;
  status: PhaseStatus;
  roles: string[];
  humanMode: HumanMode;
  startedAt?: string;
  completedAt?: string;
  artifacts: Artifact[];
  tollgate?: TollgateResult;
}

export interface Artifact {
  name: string;
  type: "spec" | "schema" | "code" | "test" | "config" | "doc";
  fromRole: string;
  preview?: string;
}

/* ── Tollgate ─────────────────────────────────────────────── */

export interface TollgateCriterion {
  name: string;
  description: string;
  score: number;
  passed: boolean;
  details?: string;
}

export interface TollgateResult {
  phaseId: PhaseId;
  overallScore: number;
  passed: boolean;
  mode: GovernanceMode;
  criteria: TollgateCriterion[];
  evaluatedAt: string;
  override?: {
    by: string;
    justification: string;
    at: string;
  };
}

/* ── Session Messages ─────────────────────────────────────── */

export interface SessionMessage {
  id: string;
  role: string;
  roleIcon: string;
  roleColor: string;
  content: string;
  timestamp: string;
  artifacts?: string[];
  referencesRole?: string;
}

export interface SessionLogEntry {
  id: string;
  timestamp: string;
  action: string;
  role?: string;
  tool?: string;
  details?: string;
}

/* ================================================================
   APP STATE
   ================================================================ */

export interface AppState {
  currentView: View;
  governanceMode: GovernanceMode;
  stories: JiraStory[];
  activeStoryId: string | null;
  activePhaseId: PhaseId | null;
  sessionMessages: SessionMessage[];
  sessionLog: SessionLogEntry[];
  activeTollgate: TollgateResult | null;
}

export const defaultState: AppState = {
  currentView: "hero",
  governanceMode: "enforced",
  stories: [],
  activeStoryId: null,
  activePhaseId: null,
  sessionMessages: [],
  sessionLog: [],
  activeTollgate: null,
};

/* ================================================================
   ACTIONS
   ================================================================ */

export type AppAction =
  | { type: "SET_VIEW"; view: View }
  | { type: "SET_GOVERNANCE"; mode: GovernanceMode }
  | { type: "INIT_STORIES"; stories: JiraStory[] }
  | { type: "PULL_STORY"; storyId: string }
  | { type: "SET_ACTIVE_STORY"; storyId: string | null }
  | { type: "APPROVE_BLUEPRINT"; storyId: string }
  | { type: "START_PHASE"; storyId: string; phaseId: PhaseId }
  | { type: "COMPLETE_PHASE"; storyId: string; phaseId: PhaseId }
  | { type: "SET_ACTIVE_PHASE"; phaseId: PhaseId | null }
  | { type: "SET_TOLLGATE"; result: TollgateResult }
  | { type: "OVERRIDE_TOLLGATE"; storyId: string; phaseId: PhaseId; by: string; justification: string }
  | { type: "SET_MESSAGES"; messages: SessionMessage[] }
  | { type: "ADD_MESSAGE"; message: SessionMessage }
  | { type: "SET_LOG"; entries: SessionLogEntry[] }
  | { type: "ADD_LOG_ENTRY"; entry: SessionLogEntry }
  | { type: "MARK_STORY_DONE"; storyId: string };

/* ================================================================
   REDUCER
   ================================================================ */

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, currentView: action.view };

    case "SET_GOVERNANCE":
      return { ...state, governanceMode: action.mode };

    case "INIT_STORIES":
      return { ...state, stories: action.stories };

    case "PULL_STORY":
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.storyId ? { ...s, status: "in_symphony" as StoryStatus } : s
        ),
      };

    case "SET_ACTIVE_STORY":
      return { ...state, activeStoryId: action.storyId };

    case "APPROVE_BLUEPRINT":
      return {
        ...state,
        stories: state.stories.map((s) => {
          if (s.id !== action.storyId || !s.blueprint) return s;
          // Create phases from blueprint if they don't exist yet
          const phases: PhaseState[] = s.phases ?? s.blueprint.phases.map((bp) => ({
            id: bp.id,
            name: bp.name,
            status: "pending" as PhaseStatus,
            roles: bp.roles,
            humanMode: bp.humanMode,
            artifacts: [],
          }));
          return {
            ...s,
            blueprint: { ...s.blueprint, approved: true },
            phases,
            startedAt: s.startedAt ?? new Date().toISOString(),
          };
        }),
      };

    case "START_PHASE":
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.storyId && s.phases
            ? {
                ...s,
                phases: s.phases.map((p) =>
                  p.id === action.phaseId
                    ? { ...p, status: "active" as PhaseStatus, startedAt: new Date().toISOString() }
                    : p
                ),
              }
            : s
        ),
      };

    case "COMPLETE_PHASE": {
      const tollgateTemplates: Record<string, { criteria: { name: string; description: string; score: number; passed: boolean }[] }> = {
        plan: {
          criteria: [
            { name: "Requirements completeness", description: "All user stories have acceptance criteria", score: 96, passed: true },
            { name: "Stakeholder sign-off", description: "Product owner has reviewed scope", score: 94, passed: true },
            { name: "Security review", description: "Security implications documented", score: 92, passed: true },
          ],
        },
        build: {
          criteria: [
            { name: "Tests passing", description: "All unit and integration tests pass", score: 100, passed: true },
            { name: "Code coverage", description: "Coverage meets 80% threshold", score: 94, passed: true },
            { name: "Security scan", description: "No critical or high vulnerabilities", score: 91, passed: true },
            { name: "Code review", description: "Peer review approved", score: 96, passed: true },
          ],
        },
        deploy: {
          criteria: [
            { name: "Staging validation", description: "All smoke tests pass in staging", score: 98, passed: true },
            { name: "Rollback plan", description: "Rollback procedure documented and tested", score: 95, passed: true },
            { name: "Monitoring configured", description: "Alerts and dashboards in place", score: 93, passed: true },
          ],
        },
      };
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.storyId && s.phases
            ? {
                ...s,
                phases: s.phases.map((p) => {
                  if (p.id !== action.phaseId) return p;
                  const template = tollgateTemplates[p.id] ?? tollgateTemplates.build;
                  const existingTollgate = p.tollgate;
                  const tollgate = existingTollgate ?? {
                    phaseId: p.id,
                    overallScore: Math.round(template.criteria.reduce((sum, c) => sum + c.score, 0) / template.criteria.length),
                    passed: true,
                    mode: state.governanceMode as "enforced" | "advisory",
                    criteria: template.criteria,
                    evaluatedAt: new Date().toISOString(),
                  };
                  return { ...p, status: "passed" as PhaseStatus, completedAt: new Date().toISOString(), tollgate };
                }),
              }
            : s
        ),
      };
    }

    case "SET_ACTIVE_PHASE":
      return { ...state, activePhaseId: action.phaseId };

    case "SET_TOLLGATE":
      return { ...state, activeTollgate: action.result };

    case "OVERRIDE_TOLLGATE":
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.storyId && s.phases
            ? {
                ...s,
                phases: s.phases.map((p) =>
                  p.id === action.phaseId && p.tollgate
                    ? {
                        ...p,
                        status: "passed" as PhaseStatus,
                        tollgate: {
                          ...p.tollgate,
                          override: {
                            by: action.by,
                            justification: action.justification,
                            at: new Date().toISOString(),
                          },
                        },
                      }
                    : p
                ),
              }
            : s
        ),
      };

    case "SET_MESSAGES":
      return { ...state, sessionMessages: action.messages };

    case "ADD_MESSAGE":
      return { ...state, sessionMessages: [...state.sessionMessages, action.message] };

    case "SET_LOG":
      return { ...state, sessionLog: action.entries };

    case "ADD_LOG_ENTRY":
      return { ...state, sessionLog: [...state.sessionLog, action.entry] };

    case "MARK_STORY_DONE":
      return {
        ...state,
        stories: state.stories.map((s) =>
          s.id === action.storyId ? { ...s, status: "done" as StoryStatus } : s
        ),
      };

    default:
      return state;
  }
}

/* ================================================================
   CONTEXT
   ================================================================ */

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: defaultState, dispatch: () => {} });

export function useApp() {
  return useContext(AppContext);
}
