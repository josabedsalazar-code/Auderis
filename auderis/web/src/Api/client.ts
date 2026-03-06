const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("auderis_token");
}

export function setToken(token: string) {
  localStorage.setItem("auderis_token", token);
}

export function clearToken() {
  localStorage.removeItem("auderis_token");
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message ?? "Error en la solicitud";
    throw new Error(message);
  }

  return response.json();
}