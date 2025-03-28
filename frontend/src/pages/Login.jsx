import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import robloxbio from "../assets/roblox-bio.png";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const [randomWords, setRandomWords] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    phrase: "",
    username: "",
  });

  const { setUserRbProf, setToken } = useContext(AppContext);

  useEffect(() => {
    async function getRandomPhrase() {
      try {
        const response = await fetch(
          "https://random-word-api.vercel.app/api?words=5"
        );
        const words = await response.json();
        setRandomWords(words.join(" "));
        setFormData({ ...formData, phrase: randomWords });
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    }

    getRandomPhrase();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      phrase: randomWords,
    }));
  }, [randomWords]);

  //LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.errors) {
      setErrors(data.errors);
      toast.error("Invalid Login");
    }
    console.log(data);
    if (
      !data.errors &&
      response.ok &&
      data.user.username === formData.username
    ) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRbProf", data.user.profile_image); // Store userRbProf
      setToken(data.token);
      setUserRbProf(data.profile_image);
      navigate("/");
    }
  };
  return (
    <>
      <div className="flex justify-center w-full text-white text-md ">
        <form>
          <div className="flex flex-col justify-center items-center border backdrop-blur-md border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800 w-fit px-10 py-5 rounded-lg">
            <h1 className="mb-5 uppercase font-bold text-3xl">Login </h1>
            <p className="mb-2">Write this phrase in your roblox bio</p>
            <div className="flex flex-col items-center">
              <div className="w-96 mb-5">
                <img
                  src={robloxbio}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex space-x-4 items-center border border-gray-700 px-4 py-2 rounded-lg mb-3">
                <p className="text-green-400">{randomWords}</p>
                <FaRegCopy
                  className="text-xl hover:cursor-pointer hover:scale-110 transition-all duration-200"
                  onClick={() => {
                    toast.success("copied");
                    navigator.clipboard.writeText(randomWords);
                  }}
                />
              </div>
              <input
                type="text"
                className={`w-80 bg-gray-900 px-4 py-2 border ${
                  errors.username || errors.description
                    ? " border-red-600"
                    : " border-white"
                } rounded-md`}
                placeholder="Enter Username..."
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                }}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username[0]}</p>
              )}
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            <div
              className="px-4 py-2 w-fit bg-gray-500 rounded-lg mt-5 uppercase cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-gray-600"
              onClick={handleLogin}
            >
              Login
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
