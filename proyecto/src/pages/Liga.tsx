import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerLigas } from "../services/ligaService";
import { obtenerEquipos } from "../services/equipoService";

interface Liga {
  desc: string;
  nombre: string;
  imagen: string;
  url: string;
}

interface Equipo {
  nombre: string;
  imagen: string;
  liga: string;
  puntos?: number;
}

const Liga = () => {
  const { nombre } = useParams<{ nombre: string }>();
  const [ligaSeleccionada, setLigaSeleccionada] = useState<Liga | null>(null);
  const [tabla, setTabla] = useState<Equipo[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const nombreNormalizado = (nombre || "").toLowerCase().replace(/-/g, " ");
        const ligas = await obtenerLigas();

        const encontrada = ligas.find(
          (item: Liga) =>
            item.url.startsWith("/liga/") &&
            item.nombre.toLowerCase() === nombreNormalizado
        );

        setLigaSeleccionada(encontrada || null);

        if (encontrada) {
          const equipos = await obtenerEquipos();
          const equiposDeLiga = equipos
            .filter((e: Equipo) => e.liga === encontrada.nombre)
            .map((e: Equipo) => ({
              ...e,
              puntos: Math.floor(Math.random() * 91), 
            }))
            .sort((a: { puntos: any; }, b: { puntos: any; }) => (b.puntos || 0) - (a.puntos || 0));

          setTabla(equiposDeLiga);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [nombre]);

  if (!ligaSeleccionada) {
    return <h2 className="text-center mt-5">Liga no encontrada</h2>;
  }

  return (
    <div className="container mt-5">
      {/* Encabezado de liga */}
      <div className="card p-4 mb-4 shadow-sm">
        <h2 className="mb-3">{ligaSeleccionada.nombre}</h2>
        <div className="d-flex align-items-center">
          <img
            src={ligaSeleccionada.imagen}
            alt={ligaSeleccionada.nombre}
            style={{ width: 80, height: 80 }}
            className="me-4"
          />
          <p className="mb-0">
            Bienvenido a la <strong>{ligaSeleccionada.nombre}</strong>
            <br />
           {ligaSeleccionada.desc}
          </p>
        </div>

        {/* Línea de temporada */}
        <div className="mt-4 px-2">
          <div className="d-flex justify-content-between text-muted">
            <span>Inicio: Agosto 2024</span>
            <span>Fin: Mayo 2025</span>
          </div>
          <div className="progress" style={{ height: "4px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tabla de posiciones */}
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">Tabla de Posiciones</h4>
        {tabla.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Logo</th>
                <th>Equipo</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((equipo, index) => (
                <tr key={equipo.nombre}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={equipo.imagen}
                      alt={equipo.nombre}
                      style={{ width: 30, height: 30 }}
                    />
                  </td>
                  <td>{equipo.nombre}</td>
                  <td>{equipo.puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No hay equipos registrados en esta liga.</p>
        )}
      </div>
    </div>
  );
};

export default Liga;
