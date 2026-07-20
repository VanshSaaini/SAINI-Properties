import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Properties from "../pages/Properties";
import PropertyDetails from "../pages/PropertyDetails";
import Services from "../pages/Services";
import Reviews from "../pages/Reviews";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<Properties />} />
      
      {/* Protected Property Layout Route */}
      <Route
        path="/property-layout/:id"
        element={
          <ProtectedRoute>
            <PropertyDetails />
          </ProtectedRoute>
        }
      />

      <Route path="/services" element={<Services />} />
      <Route path="/reviews" element={<Reviews />} />
    </Routes>
  );
}