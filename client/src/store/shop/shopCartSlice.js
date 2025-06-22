import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({userId, productId, quantity},{rejectWithValues}) => {
    try{
      const response = await axiosService.post("/Carts/add",{
        userId,
        productId,
        quantity
      })
      return response;
    }
    catch(error) {
      return rejectWithValues(error?.response?.message || error?.message)
    }
  }
)

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async ({userId},{rejectWithValues}) => {
    try{
      const response = await axiosService.get(`/Carts/get/${userId}`)
      return response;
    }
    catch(error) {
      return rejectWithValues(error?.response?.message || error?.message)
    }
  }
)

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({userId, productId},{rejectWithValues}) => {
    try{
      const response = await axiosService.delete(`/Carts/${userId}/${productId}`)
      return response;
    }
    catch(error) {
      return rejectWithValues(error?.response?.message || error?.message)
    }
  }
)

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({userId, productId, quantity},{rejectWithValues}) => {
    try{
      const response = await axiosService.put(`/updateCart`,{
        userId,
        productId, 
        quantity
      })
      return response;
    }
    catch(error) {
      return rejectWithValues(error?.response?.message || error?.message)
    }
  }
)

const shopCart = createSlice({
  name: "shopCart",
  initialState: {
    cartItems: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload?.data;
    })
    .addCase(addToCart.rejected, (state) => {
      state.isLoading = false;
      state.cartItems = []
    })
    .addCase(fetchCartItems.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchCartItems.fulfilled, (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload?.data;
    })
    .addCase(fetchCartItems.rejected, (state) => {
      state.isLoading = false;
      state.cartItems = []
    })
    .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
       .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
  }
});
export default shopCart.reducer;
