import { createSlice } from "@reduxjs/toolkit";

const requestsSlice=createSlice({
    name:"requests",
    initialState:[],
    reducers:{
        addRequests:(state,action)=>{
            return action.payload;
        },
        removeRequests:(state,action)=>{
            const newArr=state.filter((req)=>req._id != action.payload)
            return newArr
        },
        clearRequests: () => {
            return [];  
          }
    }
})

export const {addRequests,removeRequests,clearRequests}=requestsSlice.actions;
export default requestsSlice.reducer