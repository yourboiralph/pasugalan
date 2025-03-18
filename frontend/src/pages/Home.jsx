import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { user } = useContext(AppContext);

  return (
    <div>
      <Navbar />
      <p>Hi {user ? user.username : "no user"}</p>
    </div>
  );
};

export default Home;
