import { useEffect, useState } from "react";
import { checkHealth } from "../api.js";
import { ShieldIcon } from "./icons.jsx";

export default function Navbar() {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    let active = true;
    async function ping() {
      const ok = await checkHealth();
      if (active) setOnline(ok);
    }
    ping();
    const timer = setInterval(ping, 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-900/40">
            <ShieldIcon className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-base font-bold tracking-tight text-white">
              Probation Evaluator
            </h1>
            <p className="text-xs text-slate-400">Department Case Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 sm:inline-block">
            GPA Scale 4.00
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
              online === null
                ? "border-slate-700/70 bg-slate-900/60 text-slate-400"
                : online
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
            }`}
            title={online === false ? "Backend is not reachable on port 8000" : "Backend API status"}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                online === null
                  ? "bg-slate-500"
                  : online
                    ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]"
                    : "bg-rose-400"
              }`}
            />
            {online === null ? "Checking API..." : online ? "API Online" : "API Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
