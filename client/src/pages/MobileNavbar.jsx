import { Link, useLocation } from "react-router-dom";
import { FaUser, FaHeart, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";

const MobileNavbar = ({ onLogout }) => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClasses = (targetPath) =>
    `flex flex-col items-center ${
      path === targetPath ? "text-pink-800" : "text-white hover:text-pink-500"
    }`;

  return (
    <div className="w-full bg-gray-900 backdrop-blur-3xl border-t border-pink-600 shadow-lg flex justify-around items-center py-2  md:hidden">
      <Link to="/profile" className={getLinkClasses("/profile")}>
        <FaUser size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>

      <Link to="/matches" className={getLinkClasses("/matches")}>
        <FaHeart size={20} />
        <span className="text-xs mt-1">Matches</span>
      </Link>

      <Link to="/allRequests" className={getLinkClasses("/allRequests")}>
        <FaPaperPlane size={20} />
        <span className="text-xs mt-1">Requests</span>
      </Link>

      <button
        onClick={onLogout}
        className="flex flex-col items-center text-white hover:text-red-500"
      >
        <FaSignOutAlt size={20} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </div>
  );
};

export default MobileNavbar;
