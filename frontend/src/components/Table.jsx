import React, { useEffect, useState } from "react";
import SystemPetModal from "./SystemPetModal";

const Table = () => {
  const [pets, setPets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [petData, setPetData] = useState({});
  const [useCase, setUseCase] = useState("");
  const getAllPets = async () => {
    try {
      const response = await fetch("/api/petsvalue", {
        headers: {
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
    getAllPets();
  }, []);
  return (
    <>
      <div className="">
        <div
          className="px-4 py-1 bg-green-600 w-fit cursor-pointer rounded-md"
          onClick={() => {
            setOpenModal(!openModal);
            setUseCase("ADD");
            setPetData("");
          }}
        >
          Add Pets
        </div>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="mt-5 w-full bg-red-500 border border-white border-collapse">
            <thead className="bg-green-600 truncate">
              <tr className="text-sm">
                <th className="px-6 py-3 border border-white">ACTION</th>
                <th className="px-6 py-3 border border-white">ID</th>
                <th className="px-6 py-3 border border-white">Pet Name</th>
                <th className="px-6 py-3 border border-white">Normal</th>
                <th className="px-6 py-3 border border-white">Normal Fly</th>
                <th className="px-6 py-3 border border-white">Normal Ride</th>
                <th className="px-6 py-3 border border-white">
                  Normal FlyRide
                </th>
                <th className="px-6 py-3 border border-white">Neon</th>
                <th className="px-6 py-3 border border-white">Neon Fly</th>
                <th className="px-6 py-3 border border-white">Neon Ride</th>
                <th className="px-6 py-3 border border-white">Neon FlyRide</th>
                <th className="px-6 py-3 border border-white">Mega</th>
                <th className="px-6 py-3 border border-white">Mega Fly</th>
                <th className="px-6 py-3 border border-white">Mega Ride</th>
                <th className="px-6 py-3 border border-white">Mega FlyRide</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--secondary)]">
              {pets.map((pet, index) => (
                <tr key={index}>
                  <td className="px-6 py-1 border border-white">
                    <div
                      className="px-2 py-1 bg-blue-500 text-center rounded-md cursor-pointer"
                      onClick={() => {
                        setOpenModal(!openModal);
                        setUseCase("EDIT");
                        setPetData(pet);
                      }}
                    >
                      Edit
                    </div>
                  </td>
                  <td className="px-6 py-1 border border-white">{pet.id}</td>
                  <td className="px-6 py-1 border border-white">{pet.name}</td>
                  <td className="px-6 py-1 border border-white">
                    {pet.normal}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.normal_fly}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.normal_ride}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.normal_flyride}
                  </td>
                  <td className="px-6 py-1 border border-white">{pet.neon}</td>
                  <td className="px-6 py-1 border border-white">
                    {pet.neon_fly}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.neon_ride}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.neon_flyride}
                  </td>
                  <td className="px-6 py-1 border border-white">{pet.mega}</td>
                  <td className="px-6 py-1 border border-white">
                    {pet.mega_fly}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.mega_ride}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {pet.mega_flyride}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SystemPetModal
        openModal={openModal}
        onClose={() => {
          setOpenModal(!openModal);
          setPetData({});
          setUseCase("");
        }}
        useCase={useCase}
        petData={petData}
        getAllPets={getAllPets()}
      />
    </>
  );
};

export default Table;
