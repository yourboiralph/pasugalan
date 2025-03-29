import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const UserDataModal = ({
  openModal,
  onClose,
  useCase,
  userData,
  getAllUsers,
}) => {
  const { token } = useContext(AppContext);
  const [form, setForm] = useState({
    roblox_username: "",
    pet_data: [{ name: "", type: "" }],
  });

  console.log("userdata", userData);
  useEffect(() => {
    if (useCase == "EDIT") {
      setForm({
        roblox_username: userData.user.username,
        pet_data: Array.isArray(userData.pet_data)
          ? userData.pet_data
          : [{ name: userData.pet_value.name, type: userData.type }],
      });
    }
  }, [useCase, userData]);

  const updateData = async () => {
    const response = await fetch(`/api/pets/${userData.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    onClose();
    getAllUsers();
    console.log(data);
  };

  const updatePetData = (index, key, value) => {
    const updated = [...form.pet_data];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, pet_data: updated }));
  };

  const addPetRow = () => {
    setForm((prev) => ({
      ...prev,
      pet_data: [...prev.pet_data, { name: "", type: "" }],
    }));
  };

  const removePetRow = (index) => {
    const updated = [...form.pet_data];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, pet_data: updated }));
  };

  const submitData = async () => {
    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("✅ Submitted:", data);
      onClose();
      getAllUsers();
      console.log(data);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div
      className={`w-full fixed inset-0 z-50 flex items-center justify-center ${
        openModal ? "visible bg-black/80" : "invisible"
      }`}
    >
      <div className="relative w-1/2 flex items-center justify-center">
        <div
          className="absolute top-0 right-0 p-5 cursor-pointer text-white text-xl"
          onClick={onClose}
        >
          ×
        </div>
        <div className="bg-[var(--primary)] p-10 w-full rounded-lg">
          <p className="text-white text-lg font-bold mb-6">
            {useCase === "ADD" ? "Add" : "Edit"} Pet Data
          </p>

          <form className="grid grid-cols-12 gap-4 text-sm text-white">
            <div className="col-span-5">
              <label className="text-[.7rem]">Roblox Username</label>
              <input
                name="roblox_username"
                value={form.roblox_username}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    roblox_username: e.target.value,
                  }))
                }
                className="px-4 py-2 w-full text-black rounded"
                type="text"
                placeholder="Roblox Username"
              />
            </div>

            <div className="col-span-12 mt-6 space-y-4">
              {Array.isArray(form.pet_data) ? (
                form.pet_data.map((pet, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-5">
                      <label className="text-[.7rem]">Pet Name</label>
                      <input
                        type="text"
                        className="px-4 py-2 w-full text-black rounded"
                        placeholder="Pet Name"
                        value={pet.name}
                        onChange={(e) =>
                          updatePetData(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <label className="text-[.7rem]">Pet Type</label>
                      <input
                        type="text"
                        className="px-4 py-2 w-full text-black rounded"
                        placeholder="Type (e.g. normal, neon)"
                        value={pet.type}
                        onChange={(e) =>
                          updatePetData(index, "type", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2 mt-6">
                      {form.pet_data.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePetRow(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded w-full"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // fallback when pet_data is not valid
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <label className="text-[.7rem]">Pet Name</label>
                    <input
                      type="text"
                      className="px-4 py-2 w-full text-black rounded"
                      placeholder="Pet Name"
                      value={form.pet_data[0]?.name} // safer if pet_data is an array
                      onChange={(e) => {
                        const updated = [...form.pet_data];
                        updated[0].name = e.target.value;
                        setForm((prev) => ({ ...prev, pet_data: updated }));
                      }}
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="text-[.7rem]">Pet Type</label>
                    <input
                      type="text"
                      className="px-4 py-2 w-full text-black rounded"
                      placeholder="Type (e.g. normal, neon)"
                    />
                  </div>
                </div>
              )}

              {useCase == "ADD" ? (
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={addPetRow}
                  >
                    + Add Pet
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </form>

          <div className="flex items-center justify-end mt-10">
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
              onClick={() => {
                if (useCase == "ADD") {
                  submitData();
                } else if (useCase == "EDIT") {
                  updateData();
                }
              }}
            >
              {useCase === "EDIT" ? "UPDATE" : "ADD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataModal;
