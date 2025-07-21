import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerEquipos } from "../services/equipoService";
import { obtenerLigas } from "../services/ligaService";

interface Props {
  usuarioActivo: any;
  setUsuarioActivo: Function;
}

const Navbar = ({ usuarioActivo, setUsuarioActivo }: Props) => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarResultados = async () => {
      if (busqueda.trim() === "") {
        setResultados([]);
        return;
      }

      const texto = busqueda.toLowerCase();

      try {
        const [equipos, ligas] = await Promise.all([
          obtenerEquipos(),
          obtenerLigas(),
        ]);

        const equiposFiltrados = equipos
          .filter((e: any) => e.nombre.toLowerCase().includes(texto))
          .map((e: any) => ({
            ...e,
            tipo: "equipo",
            url: `/equipo/${e.nombre.toLowerCase().replace(/\s+/g, "-")}`,
          }));


        const ligasFiltradas = ligas
          .filter((l: any) => l.nombre.toLowerCase().includes(texto))
          .map((l: any) => ({
            ...l,
            tipo: "liga",
            url: `/liga/${l.nombre.toLowerCase().replace(/\s+/g, "-")}`,
          }));

        setResultados([...equiposFiltrados, ...ligasFiltradas]);
      } catch (error) {
        console.error("Error al cargar datos", error);
        setResultados([]);
      }
    };

    cargarResultados();
  }, [busqueda]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setResultados([]);
        setBusqueda("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resultados.length > 0) {
      navigate(resultados[0].url);
      setBusqueda("");
      setResultados([]);
    }
  };



  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top container-fluid"
      style={{ backgroundColor: "#001f3f" }}
    >
      <div className="container-fluid px-4">
        <Link className="navbar-brand" to="/">
          FUTSCORE
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/formulario-apuesta">
                Apostar
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/historial">
                Historial
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/recargar" className="nav-link">
                Recargas
              </Link>

            </li>

          </ul>

          <form
            className="d-flex position-relative me-3"
            onSubmit={handleSubmit}
            ref={dropdownRef}
          >
            <input
              type="search"
              className="form-control me-2"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              Buscar
            </button>

            {resultados.length > 0 && (
              <ul
                className="list-group position-absolute"
                style={{
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1050,
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {resultados.map((item, i) => (
                  <li key={i} className="list-group-item p-1">
                    <Link
                      to={item.url}
                      className="d-flex align-items-center text-dark text-decoration-none"
                      onClick={() => {
                        setBusqueda("");
                        setResultados([]);
                      }}
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                      />
                      {item.nombre}
                      <span
                        className={`badge ms-auto ${item.tipo === "liga" ? "bg-primary" : "bg-success"
                          }`}
                      >
                        {item.tipo === "liga" ? "Liga" : "Equipo"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <ul className="navbar-nav">
            {usuarioActivo ? (
              <>
                <li className="nav-item text-white d-flex align-items-center me-2">
                  Saldo: S/. {usuarioActivo.saldo?.toFixed(2) || "0.00"}
                </li>
                <li className="nav-item text-white d-flex align-items-center me-2">
                  Hola, {usuarioActivo.nombre}
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      localStorage.removeItem("usuarioActivo");
                      setUsuarioActivo(null);
                    }}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
