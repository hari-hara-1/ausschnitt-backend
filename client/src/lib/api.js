const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:1206/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "object" && payload?.error) ||
      (typeof payload === "object" && payload?.message) ||
      "Request failed";

    throw new Error(message);
  }

  return payload;
}

export function registerUser(credentials) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function fetchSnippets(token) {
  return request("/snippet/fetchAll", { token });
}

export function fetchSnippetById(snippetId, token) {
  return request(`/snippet/${snippetId}`, { token });
}

export function createSnippet(snippet, token) {
  return request("/snippet", {
    method: "POST",
    token,
    body: JSON.stringify(snippet),
  });
}

export function updateSnippet(snippetId, snippet, token) {
  return request(`/snippet/${snippetId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(snippet),
  });
}

export function deleteSnippet(snippetId, token) {
  return request(`/snippet/${snippetId}`, {
    method: "DELETE",
    token,
  });
}
