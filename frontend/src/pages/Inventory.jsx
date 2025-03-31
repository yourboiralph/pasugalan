import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Inventory = () => {
  const { token, user } = useContext(AppContext);
  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]); // Track selected pets
  const [formData, setFormData] = useState({});
  const getUserAllPet = async () => {
    try {
      const response = await fetch(`/api/getinventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setFormData({
      roblox_username: user.username,
      pet_data: selectedPets,
    });
    getUserAllPet();
  }, [user, selectedPets]);

  const handlePetClick = (pet) => {
    const isSelected = selectedPets.includes(pet.id);

    if (isSelected) {
      // Deselect the pet
      setSelectedPets((prev) => prev.filter((id) => id !== pet.id));
    } else {
      // Select the pet
      setSelectedPets((prev) => [...prev, pet.id]);
    }
  };

  const handleWithdrawClick = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/pets/withdraw", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success("Pets in Withdrawal");
      await getUserAllPet(); // Refresh inventory after action
      setSelectedPets([]); // Optional: clear selected pets after action
    }
  };

  const handleCancelWithdrawClick = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/pets/cancelwithdraw", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      toast.success("Withdrawal Cancelled");
      await getUserAllPet(); // Refresh inventory after action
      setSelectedPets([]); // Optional: clear selected pets after action
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-grow h-full px-44 py-10 bg-[#121820] text-white">
        <div className=" h-full">
          <p className="text-2xl">Inventory</p>
          <div className="mt-10 px-10 grid grid-cols-2">
            <div className="grid grid-cols-8 gap-4 max-h-[500px] overflow-y-auto">
              {pets &&
                pets.map((pet, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePetClick(pet); // Handle pet selection/deselection
                    }}
                  >
                    {pet.pet_value.name}
                    {pet.in_withdraw == true && (
                      <p className="absolute text-[0.7rem] text-red-600 font-bold">
                        In Withdraw
                      </p>
                    )}
                    {pet.in_bet == true && (
                      <p className="absolute text-[0.7rem] text-red-600 font-bold">
                        In Bet
                      </p>
                    )}
                    <img
                      src={pet.pet_value.image_link}
                      className="w-20 cursor-pointer"
                      alt={pet.pet_value.name}
                    />
                  </div>
                ))}
            </div>
            <div className="flex">
              <div className="flex h-fit space-x-4">
                <div
                  className="px-4 py-2 bg-yellow-500 w-fit rounded-lg cursor-pointer"
                  onClick={(e) => {
                    handleWithdrawClick(e);
                  }}
                >
                  Withdraw
                </div>
                <div
                  className="px-4 py-2 bg-yellow-500 w-fit rounded-lg cursor-pointer"
                  onClick={(e) => {
                    handleCancelWithdrawClick(e);
                  }}
                >
                  Cancel Withdraw
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
