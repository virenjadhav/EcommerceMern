import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/index";
import shopCart from "./shop/shopCart";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopCart: shopCart,
  },
});
