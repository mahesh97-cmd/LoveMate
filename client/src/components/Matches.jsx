import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addMatches } from "../utils/matchesSlice";
import { Link, useNavigate } from "react-router-dom";
import { useScrollToCenter } from "../utils/useScrollToCenter";


const Matches = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const matches = useSelector((state) => state.matches || []);
  const Ref=useRef()
  useScrollToCenter(Ref)

  console.log(matches,"slice")
  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getAllMatches`, {
        withCredentials: true,
      });
      const reversedMatches = [...res.data.matches].reverse()
      dispatch(addMatches(reversedMatches));
      console.log(res.data,"matches all user")
      console.log(res.data,"datdtdatd")
    } catch (err) {
      console.error("Error fetching matches", err);
    } 
  };
  useEffect(() => {
    if(matches.length===0){
        fetchMatches();
    }

    setLoading(false)
  }, []);
  return matches &&(
    <div  className="min-h-screen bg-gray-100 p-6">
      <h2 ref={Ref} className="text-3xl font-bold text-center mb-8 text-pink-600">
        Your Matches
      </h2>
  
      {loading ? (
        <div className="flex justify-center">
          <img
            src="https://i.gifer.com/ZZ5H.gif" 
            alt="Loading..."
            className="w-16 h-16"
          />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches found yet.</p>
      ) : (
        <div  className="bg-white rounded-xl shadow-md p-4 max-w-3xl mx-auto">
          {matches.map((match) => (
            <div
              key={match._id}
              className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <img
                onClick={()=>{navigate("/user-profile",{state:{id:match._id}})}}
                  src={
                    match.profilePic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
                />
                <div>
                  <h3 className="text-md font-semibold">{match.username}</h3>
                  <p className="text-sm text-gray-500">{match.caption}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {match.gender}
                  </p>
                </div>
              </div>
             <Link to={"/message/"+ match._id}>
             <button
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-full text-sm"
                
              >
                Message
              </button>
             </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Matches;
