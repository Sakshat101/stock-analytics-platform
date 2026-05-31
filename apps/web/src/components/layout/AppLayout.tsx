import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/news-sentiment', label: 'News Sentiment' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/settings', label: 'Settings' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-4 py-6 lg:block">
          <div className="mb-8">
            <div className="text-xl font-semibold tracking-tight text-blue-700">
              KiteView
            </div>
            <div className="text-xs text-slate-500">
              Indian Market Analytics
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 lg:px-6">
            <div>
              <h1 className="text-lg font-semibold">
                Market Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Live NSE analytics and portfolio intelligence
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
            >
              Live
            </motion.div>
          </header>

          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}