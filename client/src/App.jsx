import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./pages/Body";
import Login from "./components/Login";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./pages/Feed";
import Profile from "./components/Profile";
import Matches from "./components/Matches";
import Requests from "./components/Requests";
import SingleUserProfile from "./components/SingleUserProfile";
import SplashScreen from "./components/SplashScreen";
import Message from "./components/Message";
import Signup from "./components/Signup";
import OtpVerification from "./components/otpVerification";
const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/login"
            element={loading ? <SplashScreen /> : <Login />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyemail" element={<OtpVerification/>} />

          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />

            <Route path="profile" element={<Profile />} />
            <Route path="matches" element={<Matches />} />
            <Route path="allRequests" element={<Requests />} />
            <Route path="user-profile" element={<SingleUserProfile />} />
            <Route path="message/:targetId" element={<Message />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
