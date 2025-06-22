import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    orderList : [],
    orderDetail : {}
}

const orderSlice = createSlice({
    name: "orderSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {}
})
export default orderSlice.reducer;