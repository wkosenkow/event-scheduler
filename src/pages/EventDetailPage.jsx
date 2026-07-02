import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, Calendar, MapPin } from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/events/${id}`)
      .then((res) => res.json())
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
      const res = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to delete event");
      }
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
        <ChevronLeft className="w-4 h-4" />
        Back to events
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          {event.title}
        </h1>

        <div className="flex flex-col gap-4 mb-6 text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-2 text-sky-700">
              <Calendar className="w-4 h-4" />
              <span>
                {formattedDate} · {formattedTime}
              </span>
            </div>
            {event.location && (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-700">
                <MapPin className="w-4 h-4" />
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
