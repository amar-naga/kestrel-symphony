"use client";

import { useReducer, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppContext, appReducer, defaultState } from "@/lib/store";
import { SAMPLE_STORIES } from "@/lib/sample-data";
import { Navigation } from "@/components/Navigation";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { HeroSplash } from "@/components/HeroSplash";
import { BoardView } from "@/components/BoardView";
import { BlueprintView } from "@/components/BlueprintView";
import { SessionView } from "@/components/SessionView";
import { TollgateView } from "@/components/TollgateView";
import { CockpitView } from "@/components/CockpitView";
import { PlatformInspector } from "@/components/PlatformInspector";

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
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const ViewComponent = viewComponents[state.currentView];
  const showNav = state.currentView !== "hero";

  // Initialize stories on mount so all views have data
  useEffect(() => {
    dispatch({ type: "INIT_STORIES", stories: SAMPLE_STORIES });
  }, []);

  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {theme === "dark" && <FloatingOrbs />}
      {showNav && (
        <Navigation
          onToggleInspector={() => setInspectorOpen((prev) => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
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

      {/* Platform Inspector Panel */}
      <PlatformInspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} />
    </AppContext.Provider>
  );
}
