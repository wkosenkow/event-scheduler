import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Event } from "../types/event";

interface EventMutationResponse {
  error?: string;
  message?: string;
}

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then((res) => res.json())
      .then((event: Event) => {
        if (user && event.organizerId !== user.id) {
          setError("You are not authorized to edit this event.");
          setLoading(false);
          return;
        }

        setTitle(event.title);
        setDescription(event.description || "");
        if (event.date) {
          const d = new Date(event.date);
          const offset = d.getTimezoneOffset();
          const localTime = new Date(d.getTime() - offset * 60 * 1000);
          setDate(localTime.toISOString().slice(0, 16));
        }
        setLocation(event.location ?? "");
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("You must be signed in to edit an event.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date: new Date(date).toISOString(),
          location,
        }),
      });
      const data: EventMutationResponse = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update event");
      setSuccess("Event updated successfully.");
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-slate-500">Loading event details...</p>;
  }

  // If user is unauthorized, show error and back button
  if (user && error === "You are not authorized to edit this event.") {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl bg-sky-500 px-6 py-3 text-white font-semibold transition hover:bg-sky-600"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Edit event
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Update the fields below to modify your event details.
        </p>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Event title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Date and time
            </span>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Location
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="w-1/2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 font-semibold transition hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-1/2 rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400 cursor-pointer"
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
