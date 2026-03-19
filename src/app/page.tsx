"use client";

import { useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TeamContext, teamReducer, defaultState } from "@/lib/store";
import { Navigation } from "@/components/Navigation";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { HeroSplash } from "@/components/HeroSplash";
import { CatalogView } from "@/components/CatalogView";
import { ComposerView } from "@/components/ComposerView";
import { DeployView } from "@/components/DeployView";
import { CockpitView } from "@/components/CockpitView";
import { WorkspaceView } from "@/components/WorkspaceView";

const viewComponents = {
  hero: HeroSplash,
  catalog: CatalogView,
  composer: ComposerView,
  deploy: DeployView,
  cockpit: CockpitView,
  workspace: WorkspaceView,
};

export default function Home() {
  const [state, dispatch] = useReducer(teamReducer, defaultState);
  const ViewComponent = viewComponents[state.currentView];
  const showNav = state.currentView !== "hero";

  return (
    <TeamContext.Provider value={{ state, dispatch }}>
      <FloatingOrbs />
      {showNav && <Navigation />}
      <main className={`flex-1 ${showNav ? "pt-20" : ""} pb-12 px-6 relative z-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentView}
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ViewComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </TeamContext.Provider>
  );
}
