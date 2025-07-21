import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios, crearUsuario } from "../services/usuarioService";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuarios = await obtenerUsuarios();
      const yaExiste = usuarios.find((u: any) => u.nombre === nombre);
      if (yaExiste) {
        alert("Este usuario ya existe");
        return;
      }

      const nuevoUsuario = {
        nombre,
        password,
        saldo: 0,
      };

      await crearUsuario(nuevoUsuario);
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar", error);
      alert("No se pudo registrar el usuario");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100 fw-bold" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>

  );
};

export default Register;
