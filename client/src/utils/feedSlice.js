import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState:{
    users: [],
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  },  // It should be an array here, not an object
  reducers: {
    addFeed: (state, action) => {
      return action.payload;  // This should return an array of users
    },
    removeFeed: (state, action) => {
      console.log("State as JSON:", JSON.parse(JSON.stringify(state)));
      state.users = state.users.filter((user) => user._id !== action.payload);
      console.log(state.user,"state.user")
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
