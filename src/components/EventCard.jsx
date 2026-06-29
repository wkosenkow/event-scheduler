import { Link } from "react-router-dom";
import { MapPin, Clock, ChevronRight } from "lucide-react";

export default function EventCard({ event }) {
  const { id, title, description, date, location } = event;

  const d = new Date(date);
  const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const year = d.getFullYear();

  return (
    <Link
      to={`/events/${id}`}
      className="flex items-center gap-5 bg-white rounded-xl px-5 py-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow no-underline"
    >
      {/* Date block */}
      <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center rounded-lg py-2 bg-sky-50 text-sky-500">
        <span className="text-xs font-semibold tracking-widest leading-none">{month}</span>
        <span className="text-2xl font-bold leading-tight">{day}</span>
        <span className="text-xs leading-none text-slate-500">{year}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-base leading-snug truncate text-slate-900">
          {title}
        </h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
          {location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {location}
            </span>
          )}
          <span className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {time}
          </span>
        </div>
        {description && (
          <p className="text-sm mt-1 truncate text-slate-400">{description}</p>
        )}
      </div>

      <ChevronRight className="w-4 h-4 shrink-0 text-slate-300" />
    </Link>
  );
}
