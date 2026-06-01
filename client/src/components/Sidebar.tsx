import { Activity, Home, PersonStanding, User2 } from "lucide-react";
// import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/activity", label: "Activity", icon: Activity },
    { path: "/profile", label: "Profile", icon: User2 },
  ];

  // const { theme, toggleTheme } = useTheme();
  return (
    <nav className="hidden lg:flex flex-col w-64 bg-whit dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-emerald-500 flex justify-center items-center">
          <PersonStanding className="size-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Skip Fit
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({isActive}) =>
              `flex items-center gap-3 px-4 py-2.5 border-l-3 transition-all duration-200 ${isActive ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 border-transparent"}`
            }
          >
            <item.icon className="size-5" />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </div>


    </nav>
  );
};

export default Sidebar;
