import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosService.post("/shop/orders", orderData);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/shop/orders/capture", {
        paymentId,
        payerId,
        orderId,
      });

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/shop/orders/${userId}`);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/shop/orders/${id}`);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

const shopOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});
export const { resetOrderDetails } = shopOrderSlice.actions;
export default shopOrderSlice.reducer;
