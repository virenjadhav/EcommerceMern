import React from "react";
import { useState } from "react";
import AdminSideBar from "../admin/AdminSideBar";
import AdminHeader from "../admin/AdminHeader";
import {Outlet} from "react-router-dom"

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>;
};

export default AdminLayout;
