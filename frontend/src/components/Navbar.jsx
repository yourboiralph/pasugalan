import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    // Make the POST request to the /api/logout endpoint
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      // Wait for the response to be parsed as JSON
      const message = await response.json();
      localStorage.removeItem("userRbProf");
      localStorage.removeItem("token");
      toast.success(message.message);
      navigate("/login");
    } else {
      // Handle errors if the response is not OK
      console.log("Logout failed:", response.statusText);
      toast.success("Logged out Failed");
    }
  };

  return (
    <div className="bg-[#1E2A38] w-full px-10 py-5 text-lg font-semibold text-white shadow-md">
      <ul>
        <div className="flex justify-between">
          <div className="flex gap-10 items-center">
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/inventory">
              <li>Inventory </li>
            </Link>
          </div>
          <div className="flex items-center">
            <div
              className="size-14 rounded-full bg-no-repeat mr-5 border border-white"
              style={{
                backgroundImage: `url(${localStorage.getItem("userRbProf")})`,
                backgroundSize: "200%", // Zoom in 300%
                backgroundPosition: "-23px -10px", // X = 10px, Y = 20px (you can adjust these values)
              }}
            ></div>

            <Link onClick={handleLogout}>
              <li>Logout</li>
            </Link>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
