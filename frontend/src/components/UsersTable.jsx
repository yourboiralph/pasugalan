import React, { useEffect, useState } from "react";
import UserDataModal from "./UserDataModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [useCase, setUseCase] = useState("");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const getAllUsers = async (page = 1) => {
    try {
      const response = await fetch(`/api/petsall?page=${page}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUsers(data.data); // Use "data" key from Laravel response
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination.lastPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  useEffect(() => {
    getAllUsers(currentPage);
  }, [currentPage]);

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
          <table className="mt-5 w-full border-collapse table-fixed border border-white">
            <thead className="bg-green-600 sticky top-0 z-10 border border-white">
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
      <div className="flex flex-wrap gap-2 mt-4">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${
              page === pagination.currentPage
                ? "bg-green-600 text-white"
                : "bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
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
