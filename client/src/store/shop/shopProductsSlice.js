import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};
export const fetchProductDetails = createAsyncThunk(
  "shop/products/fetchProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosService.get(`shop/products/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });
    try {
      const response = await axiosService.get(`/shop/products?${query}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const shopProducts = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});
export const { setProductDetails } = shopProducts.actions;
export default shopProducts.reducer;
