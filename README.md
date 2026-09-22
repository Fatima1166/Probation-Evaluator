# Probation Evaluator

Student probation case evaluator web app. FastAPI backend + React frontend.

The original notebook (`Probation Evaluator.ipynb`) logic now runs as an API,
and the React app gives it a proper interface.

## Tech

- Backend: Python, FastAPI, Uvicorn (runs on port 8000)
- Frontend: React, Vite, Tailwind CSS (runs on port 5173)

## How to run

Open **two** PowerShell terminals.

**Terminal 1 — backend:**

```powershell
cd "d:\SIT Task\Task 3\backend"
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend:**
```powershell
cd "d:\SIT Task\Task 3\frontend"
npm.cmd run dev
```

Then open http://localhost:5173 in the browser.

Keep both terminals open while using the app.
The green "API Online" pill in the navbar means the backend is reachable.

## Notes

- Use `npm.cmd` (not `npm`) — plain `npm` gets blocked by the PowerShell
  execution policy on this machine.
- If port 8000 or 5173 is already in use, an old server is probably still
  running. Close it first (Ctrl+C in its terminal) and run the command again.
- Backend API docs: http://localhost:8000/docs
