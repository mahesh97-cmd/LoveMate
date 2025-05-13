import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { import.meta.env.VITE_BASE_KEY } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addMatches } from "../utils/matchesSlice";
import { Link, useNavigate } from "react-router-dom";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { FiMessageSquare } from "react-icons/fi";

const Matches = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matches = useSelector((state) =>  Array.isArray(state.matches) ? state.matches : []);
  console.log(matches,"matches")
  const Ref = useRef();
  useScrollToCenter(Ref);

  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_KEY}}/api/getAllMatches`, {
        withCredentials: true,
      });
      console.log(res.data,"line 24 matches")
      const reversedMatches = [...res.data.matches].reverse();
      dispatch(addMatches(reversedMatches));
      console.log(reversedMatches,"reversedMatches")
    } catch (err) {
      console.error("Error fetching matches", err);
    }finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (matches.length === 0 || !matches) {
      fetchMatches();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex-1 h-full overflow-auto bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20 p-6">
      <h2
        ref={Ref}
        className="text-3xl font-bold text-center mb-8 text-pink-900 tracking-wide"
      >
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
        <p className="text-center text-gray-400">No matches found yet.</p>
      ) : (
        <div className="  rounded-2xl w-full max-w-3xl p-6  mx-auto">
          {matches.map((match) => (
            <div
              key={match._id}
              className="flex items-center justify-between border-b border-pink-500/20 py-4 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <img
                  onClick={() =>
                    navigate("/user-profile", { state: { id: match._id } })
                  }
                  src={
                    match.profilePic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-800 cursor-pointer hover:brightness-90 transition"
                />
                <div>
                  <h3 className="text-md font-semibold text-white">
                    {match.username}
                  </h3>
                  <p className="text-sm text-pink-300">{match.caption}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {match.gender}
                  </p>
                </div>
              </div>
              <Link to={`/message/${match._id}`}>
                <button
                  className="bg-pink-800 hover:bg-pink-700 text-white p-2 rounded-full shadow-md transition"
                  title="Message"
                >
                  <FiMessageSquare className="w-5 h-5" />
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
