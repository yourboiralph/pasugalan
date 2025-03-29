import React from "react";
import UsersTable from "../../components/UsersTable";

const Users = () => {
  return (
    <div className="w-full h-full bg-[var(--tertiary)] p-24 text-white">
      <div>
        <UsersTable />
      </div>
    </div>
  );
};

export default Users;
