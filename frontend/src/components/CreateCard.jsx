import React, { useState } from "react";
import { AppContext } from "../context/AppContext";
import CreateSelectPetModal from "./CreateSelectPetModal";
import { IoMdAddCircle } from "react-icons/io";

const CreateCard = ({ value, side, betId, fetchAllActiveBets, socket }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div
      className="flex items-center justify-center cursor-pointer shadow-md border border-[#1E2A38] hover:border hover:border-[#007BFF] rounded-lg hover:bg-[#1E2A38] transition-all duration-300"
      onClick={() => {
        setOpenModal(true);
      }}
    >
      <div>
        <IoMdAddCircle size={80} color="#007BFF" />
      </div>
      <CreateSelectPetModal
        fetchAllActiveBets={fetchAllActiveBets} // Pass the function as a prop
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

export default CreateCard;
