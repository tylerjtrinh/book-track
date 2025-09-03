import { NavLink } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white hover:text-blue-200 hover:bg-slate-600 rounded-lg px-4 py-2 text-base font-medium transition-colors duration-200"
      : "text-white hover:text-blue-200 hover:bg-slate-600 rounded-lg px-4 py-2 text-base font-medium transition-colors duration-200";
  
  return (
    <nav className="bg-slate-700 border-b border-slate-400">
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        {/* Main navbar content */}
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Title - Left */}
          <div className="flex items-center">
            <NavLink className="flex items-center" to="/">
              <span className="text-white text-xl font-bold hover:text-blue-200">
                📘 BookTrack
              </span>
            </NavLink>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden sm:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <IoIosSearch className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Navigation Links - Right */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              <span className="hidden sm:inline">Explore</span> 
            </NavLink>
            <NavLink to="/my-list" className={linkClass}>
              My List
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          </div>
        </div>
        
        {/* Search Bar - Below on small screens */}
        <div className="sm:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books"
              className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <IoIosSearch className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
