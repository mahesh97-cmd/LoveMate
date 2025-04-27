import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { FaUser, FaHeart, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import { GiLovers } from "react-icons/gi";
import { removeFeed } from "../utils/feedSlice";
import { removeRequests } from "../utils/requestsSlice";
import { removeMatches } from "../utils/matchesSlice";


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      dispatch(removeFeed())
      dispatch(removeRequests())
      dispatch(removeMatches())
      navigate("/login");
      console.log(res.data, "Logged out");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Top Navbar for desktop */}
      <nav className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          <Link to="/" className="text-2xl flex font-bold text-pink-600">
            <span>LoveMate</span> <span className="px-2 "><GiLovers/></span>

          </Link>
          

          {/* Desktop Right Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-4 relative">
              <div className="relative">
                <img
                  onClick={toggleDropdown}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-pink-600"
                  src={user.profilePic}
                  alt="profile"
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
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
                      onClick={handleLogout}
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

      {/* Bottom Navbar for mobile only */}
      {user && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around items-center py-2 z-50 md:hidden">
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-700 hover:text-pink-600"
          >
            <FaUser size={20} />
            <span className="text-sm">Profile</span>
          </Link>

          <Link
            to="/matches"
            className="flex flex-col items-center text-gray-700 hover:text-pink-600"
          >
            <FaHeart size={20} />
            <span className="text-sm">Matches</span>
          </Link>

          <Link
            to="/allRequests"
            className="flex flex-col items-center text-gray-700 hover:text-pink-600"
          >
            <FaPaperPlane size={20} />
            <span className="text-sm">Requests</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-red-600 hover:text-red-700"
          >
            <FaSignOutAlt size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
