import React, { useContext, useState, useEffect } from "react";
import SelectPetModal from "./SelectPetModal";
import { AppContext } from "../context/AppContext";
import { BsThreeDots } from "react-icons/bs";
import CoinFlip from "./CoinFlip";
import toast from "react-hot-toast";

const GameCard = ({ name, bet, value, side, betId, socket, winner }) => {
  const [openModal, setOpenModal] = useState(false);
  const [petImages, setPetImages] = useState({});
  const { user, token } = useContext(AppContext);

  const getImageOfPet = async (petName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/petsvalue/${petName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data[0]?.image_link; // Extract image_link from first item
    } catch (error) {
      console.error("Error fetching pet image:", error);
      return null;
    }
  };

  const deleteEntry = async () => {
    const response = await fetch(`/api/bet/place/${betId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    toast.success("Deleted");
    socket.emit("delete_entry_from_frontend", betId);
    console.log(data);
  };

  // Fetch images for all pets when component mounts
  useEffect(() => {
    const fetchPetImages = async () => {
      const images = {};
      for (const petName of bet) {
        const imageUrl = await getImageOfPet(petName);
        images[petName] = imageUrl;
      }
      setPetImages(images);
    };

    fetchPetImages();
  }, [bet]);

  return (
    <div className="p-10 bg-[#8ba2bd] h-fit rounded-lg relative">
      <p className="font-bold">{user.username === name ? `You` : name}</p>
      {winner && (
        <div className="absolute top-5 right-5">
          <CoinFlip side={winner.toLowerCase()} />
        </div>
      )}

      <div className="flex items-center">
        {bet.slice(0, 3).map((petName, index) => (
          <div key={index}>
            {petImages[petName] && (
              <img
                src={petImages[petName]}
                alt={petName}
                className="size-10 object-cover"
              />
            )}
          </div>
        ))}

        <div className="p-1 rounded-full bg-[#121820]">
          <BsThreeDots color="white" size={20} />
        </div>
      </div>
      <p>
        Value: <span className="font-bold">{value}</span>
      </p>
      <p>
        {user.username === name ? "My" : "Opponent"} side:{" "}
        <span className="font-bold">{side}</span>
      </p>

      {user.username === name ? (
        <button
          className={`px-4 py-2 rounded-lg shadow-lg bg-red-600 mt-5`}
          onClick={() => {
            deleteEntry();
          }}
        >
          Delete Entry
        </button>
      ) : (
        <button
          className={`px-4 py-2 rounded-lg shadow-lg bg-[#007BFF] mt-5`}
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Join game
        </button>
      )}

      <SelectPetModal
        socket={socket}
        opponentValue={value}
        opponentSide={side}
        openModal={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        betId={betId}
      />
    </div>
  );
};

export default GameCard;
