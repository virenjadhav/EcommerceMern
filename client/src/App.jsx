import React from "react";
import TestComponent from "./TestComponent";
import { Button } from "./components/ui/button";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import CheckAuth from "./components/common/CheckAuth";
import AuthLayout from "./components/Layouts/AuthLayout";
import AuthLogin from "./pages/Auth/AuthLogin";
import AuthRegister from "./pages/Auth/AuthRegister";
import AdminLayout from "./components/Layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ShopLayout from "./components/Layouts/ShopLayout";
import ShopHome from "./pages/Shop/ShopHome";
import UnAuthPage from "./pages/common/UnAuthPage";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./store/authSlice";
import ShopListing from "./pages/Shop/ShopListing";
import ShopCheckout from "./pages/Shop/ShopCheckout";
import ShopAccount from "./pages/Shop/ShopAccount";
import PaypalReturn from "./pages/Shop/PaypalReturn";
import PaymentSuccessPage from "./pages/Shop/PaymentSuccessPage";
import SearchProducts from "./pages/Shop/SearchProducts";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminFeatures from "./pages/Admin/AdminFeatures";
import PaymentError from "./pages/Shop/PaymentError";


const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // useEffect
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <div style={{ width: "100vw" }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { zIndex: 100000 },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShopLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShopHome />} />
          <Route path="listing" element={<ShopListing />} />
          <Route path="checkout" element={<ShopCheckout />} />
          <Route path="account" element={<ShopAccount />} />
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/stripe-payment">
           <Route path="success" element={<PaymentSuccessPage />} />
          <Route path="error" element={<PaymentError />} />
        </Route>
        <Route
          path="/unauth-page"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UnAuthPage />
            </CheckAuth>
          }
        ></Route>
        <Route
          path="*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <NotFound />
            </CheckAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
