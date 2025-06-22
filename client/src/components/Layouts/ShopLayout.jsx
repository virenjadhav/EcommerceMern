import React from "react";
import ShopHeader from "../shop/ShopHeader";
import { Outlet } from "react-router-dom";

const ShopLayout = () => {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* header  */}
      <ShopHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ShopLayout;
