import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data.results].sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setEvents(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-slate-500">Loading events...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;
  if (events.length === 0)
    return <p className="p-8 text-slate-500">No events found.</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Upcoming Events</h1>
          <p className="text-sm text-slate-600 mt-2">
            Browse live events and click any listing for full details.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
