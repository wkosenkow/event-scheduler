import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createEvent } from "../services/eventService.js";

export default function EventsPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("You must be signed in to create an event.");
      return;
    }

    setLoading(true);

    try {
      await createEvent({
        title,
        description,
        date: new Date(date).toISOString(),
        location,
      });
      setSuccess("Event created successfully.");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Create an event
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Fill in the details to publish your next event.
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-white font-semibold transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating event..." : "Create event"}
          </button>
        </form>
      </div>
    </main>
  );
}
