import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";
import { Toaster } from "react-hot-toast";

const Admin = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for user to be fully loaded and role to be defined
    if (user && user.role) {
      if (user.role !== "admin") {
        navigate("/login");
      } else {
        setLoading(false);
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-black text-lg">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10">
        <Toaster position="top-right" />
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
