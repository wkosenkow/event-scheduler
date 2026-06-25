import { Link } from "react-router-dom";

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
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </span>
          )}
          <span className="flex items-center gap-1 flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
            </svg>
            {time}
          </span>
        </div>
        {description && (
          <p className="text-sm mt-1 truncate text-slate-400">{description}</p>
        )}
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 flex-shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
