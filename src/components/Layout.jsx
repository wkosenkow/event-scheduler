import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-950">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-5 h-5 rounded-sm bg-sky-500" />
            <span className="text-xl font-bold tracking-tight text-white">
              coolevents
            </span>
          </Link>

          {/* Auth */}
          <div className="flex items-center gap-4 text-sm font-medium text-slate-300">
            {user ? (
              <>
                <Link
                  to="/events/create"
                  className="hover:text-white transition-colors"
                >
                  Create event
                </Link>
                <span className="text-white">
                  {user.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="h-9 px-4 rounded-full text-sm font-bold cursor-pointer transition-colors bg-sky-500 text-slate-950 border-none"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-[#0fb6d8] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="h-9 px-4 rounded-full text-sm font-bold flex items-center transition-colors bg-sky-500 text-slate-950"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-14">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-sm bg-sky-500" />
              <span className="text-lg font-bold text-white">coolevents</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-3">Pages</div>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link
                to="/events/create"
                className="hover:text-white transition-colors"
              >
                Create event
              </Link>
              <Link to="/login" className="hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between flex-wrap gap-2 text-xs text-slate-500">
            <span>© 2026 coolevents. All rights reserved.</span>
            <span>Built with React + Vite · Styled with Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
