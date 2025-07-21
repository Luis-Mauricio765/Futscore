import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/usuarioService";


interface LoginProps {
  setUsuarioActivo: (usuario: any) => void;
}

const Login = ({ setUsuarioActivo }: LoginProps) => {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuario = await loginUsuario(nombre, password);
      if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        setUsuarioActivo(usuario); 
        navigate("/");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
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
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
