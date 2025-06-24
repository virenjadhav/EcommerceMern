import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  reviews: [],
};
export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axiosService.post("/shop/review/add", formdata);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message);
    }
  }
);
export const getReviews = createAsyncThunk(
  "order/getReview",
  async (id, { rejectWithValues }) => {
    try {
      const response = await axiosService.get(`/shop/review/${id}`);
      return response;
    } catch (error) {
      return rejectWithValues(error?.response?.message || error.message);
    }
  }
);
const shopReviewSlice = createSlice({
  name: "shopReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload?.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});
export default shopReviewSlice.reducer;
