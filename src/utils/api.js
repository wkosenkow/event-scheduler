const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

function getAuthToken() {
  return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
  const { method = "GET", body, headers = {}, ...rest } = options;
  const token = getAuthToken();

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const init = {
    method,
    headers: finalHeaders,
    ...rest,
  };

  if (body != null) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.error || data?.message || response.statusText || "Request failed";
    throw new Error(message);
  }

  return data;
}

export { API_URL, apiFetch };
