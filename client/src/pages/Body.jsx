// components/Body.jsx
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { clearFeed, removeFeed } from "../utils/feedSlice";
import { clearRequests } from "../utils/requestsSlice";
import { removeMatches } from "../utils/matchesSlice";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/api/user/profile", {
        withCredentials: true,
      });
      dispatch(addUser(res?.data));
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
      }
      console.error("User fetch failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/api/auth/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(clearRequests());
      dispatch(removeMatches());
      dispatch(clearFeed())

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const showNavbars = !location.pathname.startsWith("/message/");

  return (
    <div className="flex flex-col h-screen">
      <div className="h-full flex flex-col">
      {showNavbars && <Navbar onLogout={handleLogout} />}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      {user && showNavbars && <MobileNavbar onLogout={handleLogout} />}
      </div>
    </div>
  );
};

export default Body;
