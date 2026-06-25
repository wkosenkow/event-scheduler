import { apiFetch } from "../utils/api.js";

export async function loginUser(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function registerUser(name, email, password) {
  return apiFetch("/users", {
    method: "POST",
    body: { name, email, password },
  });
}
