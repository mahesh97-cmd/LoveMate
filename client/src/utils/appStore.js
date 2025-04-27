import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import feedSlice from './feedSlice';
import matchesSlice from "./matchesSlice"
import requestsSlice from "./requestsSlice"
const appStore=configureStore({
    reducer:{
        user:userSlice,
        feed:feedSlice,
        matches:matchesSlice,
        requests:requestsSlice

    },
})

export default appStore;