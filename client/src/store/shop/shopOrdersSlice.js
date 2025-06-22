import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
}

const shopOrderSlice = createSlice({
    name: "shopOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
})
export default shopOrderSlice.reducer;