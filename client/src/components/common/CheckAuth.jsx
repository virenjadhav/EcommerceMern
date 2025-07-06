import React from "react";
import { useLocation, Navigate } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  
  const location = useLocation();
  // user on home page after login, redirect him home or dashboard page based on role.
  console.log("success page", location.pathname)
  console.log("auth", isAuthenticated)
  if(location.pathname === "/shop/stripe-payment/success" || location.pathname === "/shop/stripe-payment/error" ){
    console.log("to call ", location.pathname)
   
      return <Navigate to={location.pathname} />
    
  }
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // if user is not authenticate redirect to login page
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if user is authenticate and his on login page then redirect him
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }
  //if user is trying to access admin page then redirect to him in unauth page.
  if (
    isAuthenticated &&
    location.pathname.includes("/admin") &&
    user?.role !== "admin"
  ) {
    return <Navigate to="/unauth-page" />;
  }
  // admin is trying to access user page then redirect to him in admin dashboard
  if (
    isAuthenticated &&
    location.pathname.includes("/shop") &&
    user?.role === "admin"
  ) {
    return <Navigate to="/admin/dashboard" />;
  }
  // if everything is good then render children.
  return <>{children}</>;
};

export default CheckAuth;
