import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then(setEvent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEvent(id);
      navigate("/");
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  }

  if (loading)
    return <p className="p-8 text-slate-500">Loading event details...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
  if (!event) return <p className="p-8 text-slate-500">Event not found.</p>;

  const d = new Date(event.date);
  const formattedDate = d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm mb-6 text-sky-600 hover:underline"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to events
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          {event.title}
        </h1>

        <div className="flex flex-col gap-4 mb-6 text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-sky-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"
                  strokeWidth={2}
                />
                <line
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="6"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="2"
                  x2="8"
                  y2="6"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
              </svg>
              <span>
                {formattedDate} · {formattedTime}
              </span>
            </div>
            {event.location && (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.location}
              </div>
            )}
          </div>
        </div>

        {event.description ? (
          <p className="text-base leading-7 text-slate-700">
            {event.description}
          </p>
        ) : (
          <p className="text-sm leading-7 text-slate-500">
            No additional description provided.
          </p>
        )}

        {/* Action Panel for Organizers */}
        {user && user.id === event.organizerId && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            {deleteError && (
              <span className="text-sm text-red-600 mr-auto">{deleteError}</span>
            )}
            <Link
              to={`/events/${id}/edit`}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              Edit Event
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-slate-400 cursor-pointer"
            >
              {deleting ? "Deleting..." : "Delete Event"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
