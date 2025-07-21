import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect} from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FormularioApuesta from "./pages/FormularioApuesta";
import Historial from "./pages/Historial";
import Equipo from "./pages/Equipo";
import Liga from "./pages/Liga";
import Recargar from "./pages/Recargar";
import Eleccion from "./pages/Eleccion";

import "./App.css";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("usuarioActivo");
    if (userStr) {
      setUsuarioActivo(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar usuarioActivo={usuarioActivo} setUsuarioActivo={setUsuarioActivo} />

      <main className="container-fluid flex-shrink-0">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                usuarioActivo={usuarioActivo}
                setUsuarioActivo={setUsuarioActivo}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setUsuarioActivo={setUsuarioActivo} />}
          />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/formulario-apuesta"
            element={
              usuarioActivo ? (
                <FormularioApuesta
                  usuarioActivo={usuarioActivo}
                  setUsuarioActivo={setUsuarioActivo}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/historial"
            element={
              usuarioActivo ? (
                <Historial />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/recargar"
            element={
              usuarioActivo ? (
                <Recargar setUsuarioActivo={setUsuarioActivo} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/equipo/:nombre" element={<Equipo />} />
          <Route path="/liga/:nombre" element={<Liga />} />
          <Route path="/eleccion" element={<Eleccion />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
