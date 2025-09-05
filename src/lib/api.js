export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pp_token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("pp_user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}
