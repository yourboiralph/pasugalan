import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const Guest = () => {
  return (
    <>
      <div className="bg-gray-800 h-screen w-screen flex justify-center items-center">
        <div className="container mx-auto max-w-screen-lg ">
          <Toaster position="top-right" />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Guest;
