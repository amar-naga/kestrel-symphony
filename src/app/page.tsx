"use client";

import { useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppContext, appReducer, defaultState } from "@/lib/store";
import { Navigation } from "@/components/Navigation";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { HeroSplash } from "@/components/HeroSplash";
import { BoardView } from "@/components/BoardView";
import { BlueprintView } from "@/components/BlueprintView";
import { SessionView } from "@/components/SessionView";
import { TollgateView } from "@/components/TollgateView";
import { CockpitView } from "@/components/CockpitView";

const viewComponents = {
  hero: HeroSplash,
  board: BoardView,
  blueprint: BlueprintView,
  session: SessionView,
  tollgate: TollgateView,
  cockpit: CockpitView,
};

export default function Home() {
  const [state, dispatch] = useReducer(appReducer, defaultState);
  const ViewComponent = viewComponents[state.currentView];
  const showNav = state.currentView !== "hero";

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <FloatingOrbs />
      {showNav && <Navigation />}
      <main className={`flex-1 ${showNav ? "pt-16" : ""} pb-12 px-6 relative z-10`}>
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
    </AppContext.Provider>
  );
}
