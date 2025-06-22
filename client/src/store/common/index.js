import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
  featureImageList: [],
}

const commonSlice = createSlice({
    name: "common",
    initialState, 
    reducers: {},
    extraReducers: (builder) => {}
})
export default commonSlice.reducer;