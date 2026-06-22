import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { BarChart2, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    ["Home", "/"],
    ["Dashboard", "/dashboard"],
    ["Simulator", "/simulator"],
    ["Goals", "/goals"],
    ["AI Advice", "/recommendation"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080810]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <BarChart2 size={17} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">FinSight</span>
          </Link>

          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(([name, path]) => (
              <NavLink
                key={name}
                to={path}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                  }`
                }
              >
                {name}
              </NavLink>
              
            ))}
            {isAuthenticated ? (
  <button onClick={logout} className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white">
    Logout
  </button>
) : (
  <Link to="/login" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
    Login
  </Link>
)}

          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Link
              to="/simulator"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Try Simulator
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0c0c18] px-4 py-3 space-y-1">
          {navItems.map(([name, path]) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/[0.07]">
            <Link
              to="/simulator"
              onClick={() => setIsOpen(false)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Try Simulator
            </Link>
          </div>
          
        </div>
      )}
      
    </header>
  );
}

export default Navbar;