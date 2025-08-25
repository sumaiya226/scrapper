const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function validateStep1(data: any) {
  const res = await fetch(`${base}/api/v1/validate-step1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function validateStep2(data: any) {
  const res = await fetch(`${base}/api/v1/validate-step2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function submitAll(payload: any) {
  const res = await fetch(`${base}/api/v1/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}
