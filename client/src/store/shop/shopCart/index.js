import { createSlice } from "@reduxjs/toolkit";

const shopCart = createSlice({
  name: "shopCart",
  initialState: {
    cartItems: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {},
});
export default shopCart.reducer;
