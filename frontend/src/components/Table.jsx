import React, { useEffect, useState } from "react";
import SystemPetModal from "./SystemPetModal";

const Table = () => {
  const [pets, setPets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [petData, setPetData] = useState({});
  const [useCase, setUseCase] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNoImage, setFilterNoImage] = useState(false);
  const [filterNoValue, setFilterNoValue] = useState(false);

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
  const hasAllPetValues = (pet) => {
    const fields = [
      pet.normal,
      pet.normal_fly,
      pet.normal_ride,
      pet.normal_flyride,
      pet.neon,
      pet.neon_fly,
      pet.neon_ride,
      pet.neon_flyride,
      pet.mega,
      pet.mega_fly,
      pet.mega_ride,
      pet.mega_flyride,
    ];

    return fields.every((val) => val !== null && val !== "" && val !== 0);
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
        <div className="flex flex-wrap gap-4 mt-4 items-center">
          <input
            type="text"
            placeholder="Search Pet Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterNoImage}
              onChange={() => setFilterNoImage((prev) => !prev)}
            />
            Show Pets with No Image
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterNoValue}
              onChange={() => setFilterNoValue((prev) => !prev)}
            />
            Show Pets with No Value
          </label>
        </div>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="mt-5 w-full bg-red-500 border border-white border-collapse">
            <thead className="bg-green-600 truncate sticky top-0 z-10 border border-white">
              <tr className="text-sm">
                <th className="px-6 py-3 border border-white">ACTION</th>
                <th className="px-6 py-3 border border-white">ID</th>
                <th className="px-6 py-3 border border-white">Pet Name</th>
                <th className="px-6 py-3 border border-white">With Image</th>
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
              {pets
                .filter((pet) =>
                  pet.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .filter((pet) => {
                  if (filterNoImage && pet.image_link) return false;
                  if (filterNoValue && hasAllPetValues(pet)) return false;
                  return true;
                })

                .map((pet, index) => (
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
                    <td className="px-6 py-1 border border-white">
                      {pet.name}
                    </td>
                    <td className="px-6 py-1 border text-center border-white">
                      {pet.image_link ? "✔️" : "❌"}
                    </td>
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
                    <td className="px-6 py-1 border border-white">
                      {pet.neon}
                    </td>
                    <td className="px-6 py-1 border border-white">
                      {pet.neon_fly}
                    </td>
                    <td className="px-6 py-1 border border-white">
                      {pet.neon_ride}
                    </td>
                    <td className="px-6 py-1 border border-white">
                      {pet.neon_flyride}
                    </td>
                    <td className="px-6 py-1 border border-white">
                      {pet.mega}
                    </td>
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
        getAllPets={() => {
          getAllPets();
        }}
      />
    </>
  );
};

export default Table;
