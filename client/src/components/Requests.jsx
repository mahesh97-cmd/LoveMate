import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestsSlice";
import { useNavigate } from "react-router-dom";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { addMatches } from "../utils/matchesSlice";

const Requests = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const myRef = useRef();
  useScrollToCenter(myRef);

  const getReceivedRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/api/getReceivedRequests", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.requests));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requests || requests.length === 0) {
      getReceivedRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const handleRequestResponse = async (requestId, action) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/request/${requestId}/response`,
        {
          action,
        },
        { withCredentials: true }
      );



      console.log(res.data.matchedUser,"from line no52")
      if (action === "accept") {
        dispatch(addMatches(res?.data?.matchedUser));
        navigate("/matches");

      }
      dispatch(removeRequests(requestId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    requests && (
      <div className="flex-1 h-full overflow-auto bg-gradient-to-br from-black via-gray-900 to-black text-white pb-20 p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-pink-800">
          Your Requests
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <img
              src="https://i.gifer.com/ZZ5H.gif"
              alt="Loading..."
              className="w-16 h-16"
            />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests found yet.</p>
        ) : (
          <div className="rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            {requests.map((request) => (
              <div
                key={request._id}
                className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    onClick={() => {
                      navigate("/user-profile", { state: { id: request._id } });
                    }}
                    src={
                      request.profilePic ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
                  />
                  <div>
                    <h3 className="text-md font-semibold">{request.username}</h3>
                    <p className="text-sm text-gray-500">{request.caption}</p>
                    <p className="text-xs text-gray-400 capitalize">{request.gender}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="bg-pink-500 hover:bg-pink-800 text-white p-2 rounded-full transition-transform duration-300 hover:scale-110"
                    onClick={() => handleRequestResponse(request._id, "accept")}
                    title="Accept Match"
                  >
                    <FaHeart size={20} />
                  </button>

                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full transition-transform duration-300 hover:scale-110"
                    onClick={() => handleRequestResponse(request._id, "reject")}
                    title="Reject Match"
                  >
                    <FaHeartBroken size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default Requests;
