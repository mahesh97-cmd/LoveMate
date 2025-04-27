import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-48">
      <img
        src="/assets/friendship.gif"
        alt="Loading..."
        className="w-24 h-24 object-contain"
      />
    </div>
  );
};

export default Loader;
