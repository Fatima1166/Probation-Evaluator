const API_BASE = import.meta.env.DEV ? "http://localhost:8000" : "";

// pydantic sends validation errors as a list, make it readable
function formatDetail(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = (d.loc || [])
          .filter((part) => part !== "body")
          .map((part) =>
            typeof part === "number" ? `#${part + 1}` : part.replace(/_/g, " ")
          )
          .join(" ");
        return `${field}: ${d.msg}`;
      })
      .join(" • ");
  }
  return "Something went wrong. Please check your inputs.";
}

export async function evaluateStudent(payload) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Could not reach the server. Make sure the backend is running on " +
        API_BASE
    );
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) message = formatDetail(data.detail);
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  return res.json();
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
