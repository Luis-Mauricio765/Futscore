import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerEquipoPorNombre } from "../services/equipoService";

interface Equipo {
  nombre: string;
  imagen: string;
  url: string;
  liga?: string;
}

const Equipo = () => {
  const { nombre } = useParams<{ nombre: string }>();
  console.log("Nombre desde URL:", nombre); 
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  useEffect(() => {
    const nombreNormalizado = (nombre || "").toLowerCase().replace(/-/g, " ");
    obtenerEquipoPorNombre(nombreNormalizado).then((encontrado) => {
      setEquipo(encontrado || null);
    });
  }, [nombre]);

  if (!equipo) {
    return <h2 className="text-center mt-5">Equipo no encontrado</h2>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <img
              src={equipo.imagen}
              alt={equipo.nombre}
              className="img-fluid"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <div className="col-md-9">
            <h2 className="mb-2">{equipo.nombre}</h2>
            {equipo.liga && (
              <p className="text-muted mb-1">
                <strong>Liga:</strong> {equipo.liga}
              </p>
            )}
            <p>
              Este equipo es parte de la plataforma y puedes seguir su
              rendimiento en la liga, estadísticas, jugadores destacados y más.
              Pronto habilitaremos información de partidos recientes y
              predicciones personalizadas.
            </p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center">
          <h5 className="text-muted">Estadísticas próximamente disponibles</h5>
          <p className="text-muted">
            ⚽ Goles marcados • 🛡️ Goles recibidos • 📊 Rendimiento • 🏆 Títulos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Equipo;
