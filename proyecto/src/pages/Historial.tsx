import { useEffect, useState } from "react";
import {
  obtenerApuestasPorUsuario,
  eliminarApuestaPorId,
} from "../services/apuestaService";

interface Apuesta {
  id: number;
  usuario: string;
  equipo1: { nombre: string; imagen: string };
  equipo2: { nombre: string; imagen: string };
  monto: string;
  fecha: string;
  hora: string;
  fechaHoraApuesta: string;
  opciones?: {
    seleccionGanador?: string;
    dobleOportunidad?: string;
    ambosMarcan?: string;
    goles?: string;
    corners?: string;
    tarjetas?: string;
  };
}

const Historial = () => {
  const [apuestas, setApuestas] = useState<Apuesta[]>([]);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    setUsuario(user);
    if (user) {
      cargarApuestas(user.nombre);
    }
  }, []);

  const cargarApuestas = async (username: string) => {
    try {
      const data = await obtenerApuestasPorUsuario(username);
      setApuestas(data);
    } catch (error) {
      console.error("Error al cargar apuestas", error);
      setApuestas([]);
    }
  };

  const eliminarApuesta = async (id: number) => {
    if (!confirm("¿Eliminar esta apuesta?")) return;

    try {
      await eliminarApuestaPorId(id);
      if (usuario) cargarApuestas(usuario.nombre);
    } catch (error) {
      alert("Error al eliminar la apuesta");
      console.error(error);
    }
  };

  if (!usuario) {
    return (
      <div className="container mt-5">
        <h4 className="text-center">Debes iniciar sesión para ver tu historial.</h4>
      </div>
    );
  }

  if (apuestas.length === 0) {
    return (
      <div className="container mt-5">
        <h4 className="text-center">No hay apuestas registradas.</h4>
      </div>
    );
  }

  const eliminarTodoElHistorial = async () => {
    if (!confirm("¿Eliminar todo tu historial de apuestas?")) return;

    try {
      const promesas = apuestas.map((a) => eliminarApuestaPorId(a.id));
      await Promise.all(promesas);
      setApuestas([]);
    } catch (error) {
      alert("Error al eliminar historial");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Historial de Apuestas</h2>
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Usuario</th>
            <th>Partido</th>
            <th>Monto (S/)</th>
            <th>Fecha apuesta</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {apuestas.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{usuario.nombre}</td>
              <td>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <img src={a.equipo1.imagen} alt={a.equipo1.nombre} style={{ width: 30 }} />
                  <span>{a.equipo1.nombre}</span>
                  <span className="mx-1">vs</span>
                  <span>{a.equipo2.nombre}</span>
                  <img src={a.equipo2.imagen} alt={a.equipo2.nombre} style={{ width: 30 }} />
                </div>
              </td>
              <td>{parseFloat(a.monto).toFixed(2)}</td>
              <td>{new Date(a.fechaHoraApuesta).toLocaleString()}</td>
              <td>
                <ul className="mb-0">
                  {a.opciones?.seleccionGanador && (
                    <li><strong>Ganador:</strong> {a.opciones.seleccionGanador}</li>
                  )}
                  {a.opciones?.dobleOportunidad && (
                    <li><strong>Doble Oportunidad:</strong> {a.opciones.dobleOportunidad}</li>
                  )}
                  {a.opciones?.ambosMarcan && (
                    <li><strong>Ambos Marcan:</strong> {a.opciones.ambosMarcan}</li>
                  )}
                  {a.opciones?.goles && (
                    <li><strong>Goles:</strong> {a.opciones.goles}</li>
                  )}
                  {a.opciones?.corners && (
                    <li><strong>Corners:</strong> {a.opciones.corners}</li>
                  )}
                  {a.opciones?.tarjetas && (
                    <li><strong>Tarjetas:</strong> {a.opciones.tarjetas}</li>
                  )}
                </ul>
              </td>
              <td>
                <button
                  onClick={() => eliminarApuesta(a.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {apuestas.length > 0 && (
        <div className="text-end mt-3">
          <button
            onClick={eliminarTodoElHistorial}
            className="btn btn-danger mb-4"
          >
            Borrar todo el historial
          </button>
        </div>
      )}
    </div>

  );
};

export default Historial;
