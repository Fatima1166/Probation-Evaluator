import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import StudentForm from "./components/StudentForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import { evaluateStudent } from "./api.js";
import { toPayload, validateForm } from "./formData.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);
  const [runId, setRunId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState(null);

  async function handleEvaluate(form) {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = toPayload(form);
      setLastPayload(payload);
      const data = await evaluateStudent(payload);
      setResult(data);
      setRunId((n) => n + 1);
      if (window.innerWidth < 1024) {
        document.getElementById("report")?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleNextCreditsChange(nextCredits) {
    if (!lastPayload) return;
    setRecalculating(true);
    setError(null);
    try {
      const data = await evaluateStudent({
        ...lastPayload,
        next_credits: Number(nextCredits),
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecalculating(false);
    }
  }

  function handleNewEvaluation() {
    setResult(null);
    setError(null);
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen">
      {/* background glow */}
      <div aria-hidden className="no-print pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-600/20 blur-[150px]" />
        <div className="absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[490px_minmax(0,1fr)] xl:gap-10">
          <div className="no-print lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <StudentForm
              onEvaluate={handleEvaluate}
              loading={loading}
              error={error}
            />
          </div>

          <div id="report" className="printable min-w-0">
            <ResultsPanel
              key={runId}
              result={result}
              loading={loading}
              recalculating={recalculating}
              onNewEvaluation={handleNewEvaluation}
              onNextCreditsChange={handleNextCreditsChange}
            />
          </div>
        </div>
      </main>

      <footer className="no-print relative border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        Department Probation Case Evaluator &middot; Pass CGPA &ge; 2.00 &middot; Pass Marks &ge; 50% &middot; Scale: 4.00
      </footer>
    </div>
  );
}
