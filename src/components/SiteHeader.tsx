import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Universities', to: '/universities' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/70 bg-white/85 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg">
            <span className="text-2xl font-bold">R</span>
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight text-slate-800">
              RooMio Hostels
            </span>
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Find your next campus home
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'relative transition-colors hover:text-slate-900',
                  isActive
                    ? 'text-slate-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-sky-500 after:to-cyan-400'
                    : '',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="#book"
          className="hidden rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-xl md:inline-flex"
        >
          Book a hostel
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 text-slate-600 md:hidden"
          aria-label="Mobile navigation (coming soon)"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}







