import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import RecipeIcon from '../assets/RecipeIcon.svg';
import ProfileIcon from '../assets/ProfileIcon.svg';

const Logo = () => (
  <Link to="/" className="flex flex-col items-center tracking-wide">
    <img src={RecipeIcon} alt="RecipeIcon" className="h-12 w-12 mb-1" />
    <span className="text-3xl text-orange-400 font-[pacifico]">Recipe Book</span>
  </Link>
);

const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white p-4 font-[Poppins]">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        {isLoading ? (
          <div className="text-gray-400">Loading authentication...</div>
        ) : (
          <>
            <div className="flex-grow flex justify-center">
              <div className="flex space-x-15 text-gray-400 font-medium text-lg">
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? 'text-amber-500 font-semibold' : 'hover:text-amber-500') + ' transition duration-200'}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/recipes"
                  className={({ isActive }) => (isActive ? 'text-amber-500 font-semibold' : 'hover:text-amber-500') + ' transition duration-200'}
                >
                  Recipes
                </NavLink>
                <NavLink
                  to="/meal-planner"
                  className={({ isActive }) => (isActive ? 'text-amber-500 font-semibold' : 'hover:text-amber-500') + ' transition duration-200'}
                >
                  Meal Planner
                </NavLink>
                <NavLink
                  to="/pantry-search"
                  className={({ isActive }) => (isActive ? 'text-amber-500 font-semibold' : 'hover:text-amber-500') + ' transition duration-200'}
                >
                  Pantry Search
                </NavLink>
                <NavLink
                  to="/add-recipe"
                  className={({ isActive }) => (isActive ? 'text-amber-500 font-semibold' : 'hover:text-amber-500') + ' transition duration-200'}
                >
                  Contribute
                </NavLink>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-6">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-center" 
                  >
                    <span className="block px-4 py-2 text-md text-gray-600">
                      {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Chef'}
                    </span>
                    <img src={ProfileIcon} alt="ProfileIcon" className="mr-4 h-10 w-10"/>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-3 mt-2 w-40 bg-stone-50 rounded-md shadow-lg z-8">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-left mt-2 px-6 py-4 text-base text-gray-700 hover:bg-gray-100"
                      >
                        Your Recipes
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-6 py-4 text-base text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="text-3xl tracking-wide flex items-center">
                  <img src={ProfileIcon} alt="ProfileIcon" className="mr-4 h-10 w-10"/>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;