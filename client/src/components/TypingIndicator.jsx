import React from "react";
import Lottie from "lottie-react";
import typingAnimation from "../assets/typing.json"; 
import loveAnimation from "../assets/love.json"

export const TypingIndicator = () => {
  return (
    <div className="w-16 h-16">
      <Lottie animationData={typingAnimation} loop={true} />
    </div>
  );
};


export const LoveIndicator = () => {
    return (
      <div className="w-16 h-16">
        <Lottie animationData={loveAnimation} loop={true} />
      </div>
    );
  };


