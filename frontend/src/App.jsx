import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Home from "./pages/Home"; // Import your home page component
import Explore from "./pages/Explore";
import SingleMealPage from "./pages/SingleMealPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/meal/:id" element={<SingleMealPage />} />
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
