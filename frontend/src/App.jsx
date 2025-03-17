import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Auth from "./layouts/Auth";
import Guest from "./layouts/Guest";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<Guest />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
