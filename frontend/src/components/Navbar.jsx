import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Navbar() {
  const navItems = [
    ["Home", "/"],
    ["Dashboard", "/dashboard"],
    ["Simulator", "/simulator"],
    ["Goals", "/goals"],
    ["AI", "/recommendation"],
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#05050d]/90 px-6 py-5 backdrop-blur md:px-16">
      <div className="flex items-center gap-2 text-2xl font-black">
        <Sparkles size={24} className="text-yellow-300" />
        <span>FinSight</span>
      </div>

      <div className="flex gap-8 font-bold text-purple-300">
        {navItems.map(([name, path]) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              isActive ? "text-cyan-300" : "hover:text-cyan-300"
            }
          >
            {name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;