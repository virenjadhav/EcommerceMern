import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
  searchResults: [],
}
const shopSearchSlice = createSlice({
    name: "shopSearch",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
})
export default shopSearchSlice.reducer;