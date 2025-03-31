import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Auth from "./layouts/Auth";
import Guest from "./layouts/Guest";

import Admin from "./layouts/Admin";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminSystem from "./pages/Admin/System";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
        <Route element={<Guest />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="system" element={<AdminSystem />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
