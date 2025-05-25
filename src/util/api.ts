// src/util/api.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include', // wichtig für Cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}