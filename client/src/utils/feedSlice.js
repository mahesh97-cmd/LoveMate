import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    isLoading: false,
    hasMore: true
  },
  reducers: {
    addFeed: (state, action) => {
      const newUsers = action.payload.users.filter(newUser => 
        !state.users.some(existingUser => existingUser._id === newUser._id)
      );
      state.users = [...state.users, ...newUsers];
      state.totalPages = action.payload.totalPages;
      state.totalUsers = action.payload.totalUsers;
      state.isLoading = false;
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    removeFeed: (state, action) => {
      state.users = state.users.filter(user => user._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    clearFeed: (state) => {
      state.users = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalUsers = 0;
      state.hasMore = true;
    }
  }
});

export const { 
  addFeed, 
  removeFeed, 
  clearFeed, 
  incrementPage,
  setLoading,
  setHasMore
} = feedSlice.actions;

export default feedSlice.reducer;