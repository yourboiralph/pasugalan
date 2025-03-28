import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import fly from "../assets/ride.png";
import flyride from "../assets/flyride.png";
import mega_fly from "../assets/mega_fly.png";
import mega_flyride from "../assets/mega_flyride.png";
import mega_ride from "../assets/mega_ride.png";
import neon_fly from "../assets/neon_fly.png";
import neon_flyride from "../assets/neon_flyride.png";
import neon_ride from "../assets/neon_ride.png";
import ride from "../assets/ride.png";

const CreateSelectPetModal = ({
  openModal,
  onClose,
  fetchAllActiveBets,
  socket,
}) => {
  const { user, token } = useContext(AppContext);
  const [pets, setPets] = useState([]);
  const [userValue, setUserValue] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedPets, setSelectedPets] = useState([]); // Track selected pets
  const [errors, setErrors] = useState({});
  const [opponentSideState, setOpponentSideState] = useState("Tail");

  const petTypeImages = {
    fly,
    flyride,
    mega_fly,
    mega_flyride,
    mega_ride,
    neon_fly,
    neon_flyride,
    neon_ride,
    ride,
  };

  const getUserAllPet = async () => {
    try {
      const response = await fetch(`/api/pets/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (openModal) {
      getUserAllPet();
    }
  }, [openModal]);

  // Handle pet selection/deselection
  const handlePetClick = (pet) => {
    const isSelected = selectedPets.includes(pet.id);

    if (isSelected) {
      // Deselect the pet
      setSelectedPets((prev) => prev.filter((id) => id !== pet.id));
      setUserValue((prev) => prev - pet.pet_value[pet.type]); // Subtract pet value
    } else {
      // Select the pet
      setSelectedPets((prev) => [...prev, pet.id]);
      setUserValue((prev) => prev + pet.pet_value[pet.type]); // Add pet value
    }
  };

  const handleBetClick = async () => {
    if (selectedPets.length === 0) {
      alert("Please select at least one pet.");
      return;
    }

    // Update formData based on the opponent's side
    const updatedFormData = {
      ...formData,
      [opponentSideState === "Head" ? "user_tail" : "user_head"]: user.id,
      [opponentSideState === "Head" ? "tail_pet_ids" : "head_pet_ids"]:
        selectedPets,
      isActive: true,
    };

    try {
      console.log(updatedFormData);
      const response = await fetch(`/api/bet/place`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (!response.ok) {
          setErrors({ error: data.error });
        }
      }
      console.log(data);
      if (response.ok) {
        onClose();
        setFormData({});
        setSelectedPets([]);
        setErrors({});
        fetchAllActiveBets();

        socket.emit("bet_created_from_frontend", {
          ...updatedFormData,
          roomId: data.betId,
        });
      }
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`fixed z-50 inset-0 justify-center items-center transition-colors ${
        openModal ? "visible bg-black/80" : "invisible"
      } flex justify-center items-center text-white`}
    >
      <div className="relative mx-auto w-1/2 bg-gray-400 p-4 rounded-lg">
        <p
          onClick={() => {
            onClose();
            setFormData({});
            setSelectedPets([]);
            setErrors({});
          }}
          className="absolute -top-10 -right-10 cursor-pointer"
        >
          X
        </p>
        <p className="flex items-center justify-center text-xl font-bold mb-4">
          Select Pet
        </p>
        <div className="mb-4">
          <div className="flex gap-10 items-center">
            <p>Select a side:</p>
            <div className="flex gap-4">
              <div
                onClick={() => {
                  setOpponentSideState("Tail");
                }}
                className={`px-4 py-2 ${
                  opponentSideState == "Tail" ? "bg-green-600" : "bg-gray-600"
                } w-24 text-center`}
              >
                Head
              </div>
              <div
                onClick={() => {
                  setOpponentSideState("Head");
                }}
                className={`px-4 py-2 ${
                  opponentSideState == "Head" ? "bg-green-600" : "bg-gray-600"
                } w-24 text-center`}
              >
                Tail
              </div>
            </div>
          </div>
          <p>Your Value: {userValue}</p>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {pets.map((pet, index) => {
            const isSelected = selectedPets.includes(pet.id); // Check if pet is selected

            return (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  isSelected ? "bg-blue-200" : "bg-gray-200"
                }`}
              >
                <div className="relative w-fit">
                  <img
                    src={pet.pet_value.image_link}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePetClick(pet); // Handle pet selection/deselection
                    }}
                    className="w-20 cursor-pointer"
                    alt={pet.pet_value.name}
                  />
                  {pet.type && petTypeImages[pet.type] && (
                    <img
                      src={petTypeImages[pet.type]}
                      className="w-14 absolute bottom-0 right-0"
                      alt={pet.type}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Value: {pet.pet_value[pet.type] || "No value yet"}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-10">
          <div
            onClick={() => {
              handleBetClick();
            }}
            className="px-4 py-2 bg-green-500 w-fit cursor-pointer"
          >
            Bet {opponentSideState == "Head" ? "Tail" : "Head"}
          </div>
          {errors && <p className="text-sm text-red-600">{errors?.error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreateSelectPetModal;
