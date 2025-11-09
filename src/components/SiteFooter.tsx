import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Universities', to: '/universities' },
  { label: 'About RooMio', to: '#' },
  { label: 'Support', to: '#' },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-sky-100 bg-white/85 backdrop-blur">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white shadow-lg">
            <span className="text-2xl font-bold">R</span>
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900">RooMio Hostels</p>
            <p className="text-sm text-slate-500">
              Modern hostel management for universities across Africa.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
          {footerLinks.map((link) => (
            <Link key={link.label} to={link.to} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} RooMio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}






