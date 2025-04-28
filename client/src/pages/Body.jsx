import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user=useSelector((state)=>state.user)
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL+"/api/user/profile", {
        withCredentials: true,
      });
     
      dispatch(addUser(res?.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.log(error);
    }
  };
  useEffect(() => {
    if(!user){
      fetchUser();
    }
    
  }, []);
  const shouldShowNavbar = !["/login", "/signup"].includes(location.pathname)

console.log(shouldShowNavbar,"location")
  return (
    <div className="flex flex-col">
      {shouldShowNavbar&&<Navbar />}
      <main className="min-h-screen bg-pink-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Body;
