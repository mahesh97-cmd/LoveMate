import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeed,
  incrementPage,
  removeFeed,
  setHasMore,
  setLoading,
} from "../utils/feedSlice";
import { useScrollToCenter } from "../utils/useScrollToCenter";
import { LoveIndicator } from "../components/TypingIndicator";
import { AiOutlineHeart } from "react-icons/ai";

const Feed = () => {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  const [loveToast, setLoveToast] = useState(false);
  const [receiver, setReceiver] = useState("");

  const myref = useRef();
  useScrollToCenter(myref);

  const handleSwipe = (direction) => {
    if (direction === "up") {
      if (current < feed.users.length - 1) {
        setCurrent(current + 1);
      } else if (
        current === feed.users.length - 1 &&
        feed.hasMore &&
        !feed.isLoading
      ) {
        getFeed();
      }
    } else if (direction === "down" && current > 0) {
      setCurrent(current - 1);
    }
  };

  const detectSwipe = (e, info) => {
    const { offset } = info;
    if (offset.y < -100) handleSwipe("up");
    else if (offset.y > 100) handleSwipe("down");
  };

  const getFeed = async () => {
    if (feed.isLoading || !feed.hasMore) return;

    dispatch(setLoading(true));

    try {
      const res = await axios.get(
        `${BASE_URL}/api/user/all?page=${feed.currentPage - 1}`,
        {
          withCredentials: true,
        }
      );
      console.log(res?.data?.users,"from backend")
      const newUsers = res?.data?.users || [];
      console.log(newUsers, "newUsers");
      const totalPages = res?.data?.totalPages || 1;

      if (newUsers.length > 0) {
        dispatch(
          addFeed({
            users: newUsers,
            totalPages,
            totalUsers: res.data.totalUsers,
          })
        );
        dispatch(incrementPage());
      }

      if (feed.currentPage >= totalPages || newUsers.length === 0) {
        dispatch(setHasMore(false));
      }
    } catch (error) {
      console.error(error);
      dispatch(setHasMore(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const sendConnection = async (id) => {
    try {
      setLoveToast(true);
      const res = await axios.post(
        `${BASE_URL}/api/send/request/${id}`,
        {},
        { withCredentials: true }
      );
      setReceiver(res?.data?.receiver?.username);
      dispatch(removeFeed(id));
      setTimeout(() => setLoveToast(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };
console.log(feed.isLoading,"loading...")
  useEffect(() => {
    if (feed.users.length === 0) {
      getFeed();
    }
  }, []);

  return (
    feed && (
      <div className="w-full h-full flex items-center justify-center bg-black text-white relative overflow-hidden border-t border-pink-800">
        {loveToast && (
          <div className="absolute top-0 left-0 w-full h-full bg-black z-50 flex flex-col items-center justify-center">
            <span>
              <LoveIndicator />
            </span>
            <span>
              <p className="text-pink-500 font-bold">
                You are Connecting with {receiver}
              </p>
            </span>
          </div>
        )}
        {feed.isLoading && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black px-4 py-2 rounded-full text-white border border-pink-600">
            Loading more users...
          </div>
        )}

        <AnimatePresence>
          {feed?.users?.length > 0 ? (
            <motion.div
              ref={myref}
              key={feed?.users[current]?._id}
              className="absolute w-full h-full md:w-[400px] md:h-[600px] md:rounded-3xl md:shadow-2xl md:overflow-hidden flex items-end justify-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${feed?.users[current]?.profilePic})`,
              }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.4 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={detectSwipe}
            >
              <div className="absolute left-0 w-full bg-gradient-to-t from-black/30 via-black/50 to-transparent px-6 py-6 ">
                <div className="flex items-center w-full justify-between gap-6 bg-black/60 backdrop-blur-sm p-2 rounded-3xl shadow-2xl border-2 border-pink-800 border-t-0 ">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-pink-500 flex-shrink-0">
                      <img
                        src={feed?.users[current]?.profilePic}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-white">
                      <h2 className="text-xl font-semibold">
                        {feed?.users[current]?.username}
                      </h2>
                      <p className="text-sm opacity-80 text-pink-500">
                        {feed?.users[current]?.caption}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => sendConnection(feed?.users[current]?._id)}
                      className="bg-pink-800 hover:bg-pink-700 text-white border-2 p-3 rounded-full transition-transform transform hover:scale-110 shadow-lg focus:outline-none"
                    >
                      <AiOutlineHeart className="text-4xl" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">
                No more users available 😔
              </h1>
              
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  );
};

export default Feed;
