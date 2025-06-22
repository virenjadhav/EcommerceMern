import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    addressList: []
}
const shopAddressSlice = createSlice({
    name: "shopAddress",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
})

export default shopAddressSlice.reducer;