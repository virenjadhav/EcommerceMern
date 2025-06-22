import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const initialState = {
    isLoading: false,
    productList: []
}

export const deleteProduct = createAsyncThunk("admin/product/deleteProducts",
    async (id, {rejectWithValue}) => {
        try{
            const response = await axiosService.delete(`/admin/products/${id}`);
            return response;
        } catch(error) {
            return rejectWithValue(error.response.message || error.message);
        }
    }
)
export const fetchAllProducts = createAsyncThunk("admin/products/fetchAllProducts", 
    async (formData, {rejectWithValue}) => {
        try{
            const response = await axiosService.get("/admin/products");
            return response;
        } catch(error) {
            return rejectWithValue(error.response.message || error.message);
        }
    }
)
export const editProduct = createAsyncThunk("admin/products/edit", 
    async ({ id, formData }, { rejectWithValue }) => {
        try{
            const response = axiosService.put(`/admin/products/${id}`, formData)
            return response;
        } catch(error) {
            return rejectWithValue(error.response?.message || error.message)
        }
    }
)

export const addNewProduct = createAsyncThunk("admin/products/edit", 
    async (formData, {rejectWithValue}) =>{
        try{
            const response = axiosService.post(`/admin/products`, formData)
            return response;
        } catch(error) {
            return rejectWithValue(error.response?.message || error.message)
        }
    }
)
const adminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = action.payload?.data;
        })
        .addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false;
            state.productList = []
        })
    }
})
export default adminProductsSlice.reducer;