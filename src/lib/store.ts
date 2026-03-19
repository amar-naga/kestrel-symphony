"use client";

import { createContext, useContext } from "react";

export type View = "hero" | "catalog" | "composer" | "deploy" | "cockpit" | "workspace";
export type GovernanceMode = "advisory" | "enforced";

export interface TeamState {
  selectedRoles: string[];
  vertical: string;
  governanceMode: GovernanceMode;
  engine: string;
  currentView: View;
}

export const defaultState: TeamState = {
  selectedRoles: [],
  vertical: "real_estate",
  governanceMode: "enforced",
  engine: "crewai",
  currentView: "hero",
};

export type TeamAction =
  | { type: "TOGGLE_ROLE"; roleId: string }
  | { type: "SET_VERTICAL"; vertical: string }
  | { type: "SET_GOVERNANCE"; mode: GovernanceMode }
  | { type: "SET_ENGINE"; engine: string }
  | { type: "SET_VIEW"; view: View };

export function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case "TOGGLE_ROLE": {
      const exists = state.selectedRoles.includes(action.roleId);
      return {
        ...state,
        selectedRoles: exists
          ? state.selectedRoles.filter((r) => r !== action.roleId)
          : [...state.selectedRoles, action.roleId],
      };
    }
    case "SET_VERTICAL":
      return { ...state, vertical: action.vertical };
    case "SET_GOVERNANCE":
      return { ...state, governanceMode: action.mode };
    case "SET_ENGINE":
      return { ...state, engine: action.engine };
    case "SET_VIEW":
      return { ...state, currentView: action.view };
    default:
      return state;
  }
}

export const TeamContext = createContext<{
  state: TeamState;
  dispatch: React.Dispatch<TeamAction>;
}>({ state: defaultState, dispatch: () => {} });

export function useTeam() {
  return useContext(TeamContext);
}
