import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  addressList: [],
};
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosService.post("/shop/address", formData);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error?.message);
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosService.get(`/shop/address/${userId}`);

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosService.put(
        `/shop/address/${userId}/${addressId}`,
        formData
      );

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axiosService.delete(
        `/shop/address/${userId}/${addressId}`
      );

      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.message || error.message);
    }
  }
);
const shopAddressSlice = createSlice({
  name: "shopAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default shopAddressSlice.reducer;
