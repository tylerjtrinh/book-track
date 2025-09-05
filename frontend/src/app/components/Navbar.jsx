import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearCredentials } from '../slices/authSlice';
import { IoIosArrowDown } from "react-icons/io";
import SearchBar from './SearchBar';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleSearch = (searchTerm) => {
    // Navigate to search results page with query parameter
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };
  
  const logoutHandler = async () => {
    try {
        //Sending post request to users API to logout
        await logout().unwrap();
        dispatch(clearCredentials());
        setIsDropdownOpen(false);
        navigate('/');
    } catch (error) {
        console.log(error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
    
  const linkClass = 
  "text-white hover:text-blue-200 hover:bg-slate-600 rounded-lg px-4 py-2 text-base font-medium transition-colors duration-200";
  
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
          <SearchBar 
            className="hidden sm:flex flex-1 max-w-md mx-8"
            onSearch={handleSearch}
          />

          {/* Navigation Links - Right */}
          <div className="flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              <span className="hidden sm:inline">Home</span> 
            </NavLink>
            <NavLink to="/my-list" className={linkClass}>
              My List
            </NavLink>
            { userInfo ? (
                <>
                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-2 text-white hover:text-blue-200 hover:bg-slate-600 rounded-lg px-4 py-2 text-base font-medium transition-colors duration-200 cursor-pointer"
                    >
                      {userInfo.username}
                      <IoIosArrowDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-600 rounded-lg shadow-lg border border-slate-500 z-50">
                        <div className="py-1">
                          <NavLink
                            to="/profile" onClick={toggleDropdown}
                            className="block px-4 py-2 text-sm text-white hover:bg-slate-500 cursor-pointer">
                            Profile
                          </NavLink>
                          <button
                            onClick={logoutHandler}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-500 cursor-pointer">
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
            ) : (
                <>
                <NavLink to="/login" className={linkClass}>
                Login
                </NavLink>
                </>
            ) }
          </div>
        </div>
        
        {/* Search Bar - Below on small screens */}
        <SearchBar 
          className="sm:hidden pb-4"
          onSearch={handleSearch}
        />
      </div>
    </nav>
  );
};

export default Navbar;
