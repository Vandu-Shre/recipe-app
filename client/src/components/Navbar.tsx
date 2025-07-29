// client/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  if (isLoading) {
    return (
      <nav className="bg-zinc-900 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center py-2">
          <Link to="/" className="text-white text-2xl font-bold tracking-wide flex items-center">
            <span role="img" aria-label="utensils" className="mr-2 text-amber-500 text-3xl">🍽️</span>
            Flavoriz
          </Link>
          <div className="text-gray-400">Loading authentication...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-zinc-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-2">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white text-2xl font-bold tracking-wide flex items-center">
            <span role="img" aria-label="utensils" className="mr-2 text-amber-500 text-3xl">🍽️</span>
            Flavoriz
          </Link>

          {user ? (
            <div className="flex space-x-6 text-gray-200 font-medium text-lg">
              <NavLink
                to="/recipes"
                className={({ isActive }) => (isActive ? 'text-amber-500' : 'hover:text-amber-500') + ' transition duration-200'}
              >
                Recipes
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'text-amber-500' : 'hover:text-amber-500') + ' transition duration-200'}
              >
                Profile
              </NavLink>
              <NavLink
                to="/add-recipe"
                className={({ isActive }) => (isActive ? 'text-amber-500' : 'hover:text-amber-500') + ' transition duration-200'}
              >
                Add Recipe
              </NavLink>
            </div>
          ) : (
            null
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <button className="text-gray-400 hover:text-amber-500 flex items-center justify-center"> 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-amber-500 flex items-center justify-center"> 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-gray-400 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 rounded-full flex items-center justify-center" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-10">
                    <span className="block px-4 py-2 text-sm text-gray-700">Hello, {user?.username || user?.email || 'User'}!</span>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Logged-out state: Show "Get Started" button
            <Link 
              to="/auth" 
              className="bg-[#6F4E37] hover:bg-[#5A3F2A] text-white font-lora font-semibold py-2 px-5 rounded-lg transition duration-200 shadow-md"
            >
              Get Started →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;