import React, { useEffect, useState } from "react";

const SystemPetModal = ({
  openModal,
  onClose,
  useCase,
  petData,
  getAllPets,
}) => {
  const [form, setForm] = useState({
    name: "",
    normal: "",
    normal_fly: "",
    normal_ride: "",
    normal_flyride: "",
    neon: "",
    neon_fly: "",
    neon_ride: "",
    neon_flyride: "",
    mega: "",
    mega_fly: "",
    mega_ride: "",
    mega_flyride: "",
    image_link: "",
  });

  const addPet = async () => {
    const response = await fetch("/api/petsvalue", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    onClose();
    getAllPets();
    console.log(data);
  };

  const editPet = async () => {
    const response = await fetch(`/api/petsvalue/${petData.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    onClose();
    getAllPets();
    console.log(data);
  };

  useEffect(() => {
    if (useCase === "EDIT" && petData) {
      setForm({
        name: petData.name || "",
        normal: petData.normal || "",
        normal_fly: petData.normal_fly || "",
        normal_ride: petData.normal_ride || "",
        normal_flyride: petData.normal_flyride || "",
        neon: petData.neon || "",
        neon_fly: petData.neon_fly || "",
        neon_ride: petData.neon_ride || "",
        neon_flyride: petData.neon_flyride || "",
        mega: petData.mega || "",
        mega_fly: petData.mega_fly || "",
        mega_ride: petData.mega_ride || "",
        mega_flyride: petData.mega_flyride || "",
        image_link: petData.image_link || "",
      });
    } else if (useCase === "ADD") {
      setForm({
        name: "",
        normal: "",
        normal_fly: "",
        normal_ride: "",
        normal_flyride: "",
        neon: "",
        neon_fly: "",
        neon_ride: "",
        neon_flyride: "",
        mega: "",
        mega_fly: "",
        mega_ride: "",
        mega_flyride: "",
        image_link: "",
      });
    }
  }, [useCase, petData]);

  return (
    <div
      className={`w-full fixed inset-0 z-50 flex items-center justify-center ${
        openModal ? "visible bg-black/80" : "invisible"
      }`}
    >
      <div className="relative w-1/2 flex items-center justify-center">
        <div
          className="absolute top-0 right-0 p-5 cursor-pointer"
          onClick={onClose}
        >
          x
        </div>
        <div className="bg-[var(--primary)] p-10 w-full">
          <p className="text-white text-lg font-bold">
            {useCase == "ADD" ? "Add" : "Edit"} A Pet
          </p>
          <form className="mt-10 grid grid-cols-4 gap-4 text-sm text-white">
            <div className="col-span-1">
              <label className="text-[.7rem]">Pet Name</label>
              <input
                name="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="px-4 py-1 w-full text-black"
                type="text"
                placeholder="Pet Name"
              />
            </div>

            <div className="col-span-4 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {/* Normal Set */}
                <div>
                  <label className="text-[.7rem]">Normal</label>
                  <input
                    name="normal"
                    value={form.normal}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, normal: e.target.value }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Normal"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Normal Fly</label>
                  <input
                    name="normal_fly"
                    value={form.normal_fly}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        normal_fly: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Normal Fly"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Normal Ride</label>
                  <input
                    name="ride"
                    value={form.normal_ride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        normal_ride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Normal Ride"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Normal Fly Ride</label>
                  <input
                    name="flyride"
                    value={form.normal_flyride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        normal_flyride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Normal Fly Ride"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Neon Set */}
                <div>
                  <label className="text-[.7rem]">Neon</label>
                  <input
                    name="neon"
                    value={form.neon}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, neon: e.target.value }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Neon"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Neon Fly</label>
                  <input
                    name="neon_fly"
                    value={form.neon_fly}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        neon_fly: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Neon Fly"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Neon Ride</label>
                  <input
                    name="neon_ride"
                    value={form.neon_ride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        neon_ride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Neon Ride"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Neon Fly Ride</label>
                  <input
                    name="neon_flyride"
                    value={form.neon_flyride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        neon_flyride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Neon Fly Ride"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Mega Set */}
                <div>
                  <label className="text-[.7rem]">Mega</label>
                  <input
                    name="mega"
                    value={form.mega}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, mega: e.target.value }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Mega"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Mega Fly</label>
                  <input
                    name="mega_fly"
                    value={form.mega_fly}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        mega_fly: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Mega Fly"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Mega Ride</label>
                  <input
                    name="mega_ride"
                    value={form.mega_ride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        mega_ride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Mega Ride"
                  />
                </div>
                <div>
                  <label className="text-[.7rem]">Mega Fly Ride</label>
                  <input
                    name="mega_flyride"
                    value={form.mega_flyride}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        mega_flyride: e.target.value,
                      }));
                    }}
                    className="px-4 py-1 w-full text-black"
                    type="text"
                    placeholder="Mega Fly Ride"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <label className="text-[.7rem]">Image Link</label>
              <input
                name="name"
                value={form.image_link}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image_link: e.target.value,
                  }))
                }
                className="px-4 py-1 w-full text-black"
                type="text"
                placeholder="Image Link"
              />
            </div>
          </form>

          <div className="flex items-center justify-end mt-10">
            <button
              className="px-4 py-2 bg-green-500 rounded-lg"
              onClick={() => {
                useCase == "ADD" ? addPet() : editPet();
              }}
            >
              {useCase == "ADD" ? "ADD" : "UPDATE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPetModal;
