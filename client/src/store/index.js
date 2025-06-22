import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminProductsSlice from "./admin/adminProductSlice";
import adminOrderSlice from "./admin/adminOrderSlice";

import shopProductsSlice from "./shop/shopProductsSlice";
import shopCartSlice from "./shop/shopCartSlice";
import shopAddressSlice from "./shop/shopAddressSlice";
import shopOrderSlice from "./shop/shopOrdersSlice";
import shopSearchSlice from "./shop/shopSearchSlice";
import shopReviewSlice from "./shop/shopReviewSlice";
import commonFeatureSlice from "./common";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
