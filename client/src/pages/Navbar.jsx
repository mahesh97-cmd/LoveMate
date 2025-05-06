import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { GiLovers } from "react-icons/gi";

const Navbar = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profilePicRef = useRef(null); // Added ref for profile pic

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close dropdown if the click is outside the profile pic or dropdown
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profilePicRef.current && !profilePicRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const showNavbar = !location.pathname.startsWith("/message/");

  return (
    <>
      {showNavbar && (
        <nav className="bg-gray-900 backdrop-blur-sm border-b border-pink-600 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl flex font-bold text-pink-800">
              <span>LoveMate</span>
              <span className="px-2">
                <GiLovers />
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center space-x-4 relative">
                <div className="relative">
                  <img
                    ref={profilePicRef} // Added ref to profile pic
                    onClick={toggleDropdown}
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-pink-600 object-contain"
                    src={user.profilePic}
                    alt="profile"
                  />
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/matches"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100"
                      >
                        Matches
                      </Link>
                      <Link
                        to="/allRequests"
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100"
                      >
                        Requests
                      </Link>
                      <button
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-center">Hey {user.username}</p>
              </div>
            )}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
