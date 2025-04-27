// Feed.js
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useScrollToCenter } from "../utils/useScrollToCenter";



const Feed = () => {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);
  console.log(feed?.users, "feed data");
  const myref=useRef()
  useScrollToCenter(myref)

  const handleSwipe = (direction) => {
    if (direction === "up" && current < feed?.users.length - 1) {
      setCurrent(current + 1);
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
    if (feed?.users?.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/user/all", {
        withCredentials: true,
      });
      console.log(res.data, "feed");
      dispatch(addFeed(res?.data));
      console.log(res.data,"home page")
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  return (
    feed && (
      <div    className="h-screen w-full  flex items-center justify-center bg-black text-white relative overflow-hidden border-2 border-pink-600 ">
        <AnimatePresence>
          {/* <motion.div
          key={feed?.users[current].id}
          className="absolute  w-full h-full md:w-[400px] md:h-[600px] md:rounded-2xl md:shadow-2xl md:overflow-hidden flex flex-col items-center justify-center text-center bg-cover bg-center"
          style={{ backgroundImage: `url(${feed?.users[current]?.profilePic})` }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.4 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.8}
          onDragEnd={detectSwipe}
        >
          <div className="bg-black bg-opacity-30 p-6 rounded-xl w-full">
            <h2 className="text-3xl font-bold">{feed?.users[current].username}, {feed?.users[current].age}</h2>
            <p className="mt-2">{feed?.users[current].bio}</p>
          </div>
        </motion.div> */}
          <motion.div
          ref={myref}
            key={feed?.users[current]._id}
            className="absolute w-full h-full md:w-[400px] md:h-[600px] md:rounded-2xl md:shadow-2xl md:overflow-hidden flex items-end justify-center bg-cover bg-center "
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
            <div  className="absolute  bottom-14 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 py-0">
              <div  className="flex items-center justify-between gap-4 bg-black/50 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                {/* Profile Picture */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500 flex-shrink-0">
                  <img
                    src={feed?.users[current].profilePic}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Username and Info */}
                <div className="flex-1 text-white">
                  <h2 className="text-lg font-semibold">
                    {feed?.users[current].username}
                  </h2>
                  <p className="text-sm opacity-80">
                    {feed?.users[current].caption}
                  </p>
                </div>

                {/* Interest Button */}
                <div>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm shadow-md transition">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  );
};

export default Feed;
