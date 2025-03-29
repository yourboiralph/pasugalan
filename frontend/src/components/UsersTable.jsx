import React, { useEffect, useState } from "react";
import UserDataModal from "./UserDataModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [useCase, setUseCase] = useState("");
  const getAllUsers = async () => {
    try {
      const response = await fetch("/api/pets", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="">
        <div
          className="px-4 py-1 bg-green-600 w-fit cursor-pointer rounded-md"
          onClick={() => {
            setOpenModal(!openModal);
            setUseCase("ADD");
            setUserData("");
          }}
        >
          Add User Pets
        </div>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="mt-5 w-full bg-red-500 border border-white border-collapse">
            <thead className="bg-green-600 truncate">
              <tr className="text-sm">
                <th className="px-6 py-3 border border-white">ACTION</th>
                <th className="px-6 py-3 border border-white">ID</th>
                <th className="px-6 py-3 border border-white">User</th>
                <th className="px-6 py-3 border border-white">Pet</th>
                <th className="px-6 py-3 border border-white">Type</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--secondary)]">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-1 border border-white">
                    <div
                      className="px-2 py-1 bg-blue-500 text-center rounded-md cursor-pointer"
                      onClick={() => {
                        setOpenModal(!openModal);
                        setUseCase("EDIT");
                        setUserData(user);
                      }}
                    >
                      Edit
                    </div>
                  </td>
                  <td className="px-6 py-1 border border-white">{user.id}</td>
                  <td className="px-6 py-1 border border-white">
                    {user.user.username}
                  </td>
                  <td className="px-6 py-1 border border-white">
                    {user.pet_value.name}
                  </td>
                  <td className="px-6 py-1 border border-white">{user.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserDataModal
        openModal={openModal}
        onClose={() => {
          setOpenModal(!openModal);
        }}
        useCase={useCase}
        userData={userData}
        getAllUsers={getAllUsers}
      />
    </>
  );
};

export default UsersTable;
