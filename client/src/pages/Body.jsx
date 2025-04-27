import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user=useSelector((state)=>state.user)
  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL+"/user/profile", {
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

  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="min-h-screen bg-pink-50">
        {/* Content from nested routes like Feed, Profile, etc. will be rendered here */}
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Body;
