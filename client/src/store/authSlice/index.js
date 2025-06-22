import axiosService from "@/utils/AxiosService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// login user service
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosService.post("/auth/login", formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message);
    }
  }
);

// register user
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (formData, { rejectWithValue }) => {
//     // try {
//     // const response = await axiosService.post("/auth/signup", formData);
//     const response = await axios.post(
//       "http://localhost:5173/api/v1/auth/signup",
//       formData,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//     // } catch (error) {
//     //   return rejectWithValue(error.response.data || error.message);
//     // }
//   }
// );
export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosService.post("/auth/signup", formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message);
    }
  }
);

// check auth every time when app loads
export const checkAuth = createAsyncThunk(
  "/auth/check-auth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosService.get("/auth/checkAuth");
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", 
  async (formData, {rejectWithValue}) => {
    try{
      const response = await axiosService.delete("/auth/logout")
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.message || error.message)
    }
  }
);

const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: initialState,
  reducers: {
    setIsLogged: (state, action) => {
      state.isLogged = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.success ? action.payload?.user : null;
        state.isAuthenticated = action.payload?.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.success;
        state.user = action.payload?.success ? action.payload?.user : null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
      })
  },
});
export const { setIsLogged } = AuthSlice.actions;
export default AuthSlice.reducer;
