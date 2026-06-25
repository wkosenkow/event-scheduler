import { apiFetch } from "../utils/api.js";

export async function getEvents() {
  return apiFetch("/events");
}

export async function getEventById(id) {
  return apiFetch(`/events/${id}`);
}

export async function createEvent(eventData) {
  return apiFetch("/events", {
    method: "POST",
    body: eventData,
  });
}
