import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEquipos } from "../services/equipoService";

interface Props {
  usuarioActivo: any;
  setUsuarioActivo: (usuario: any) => void;
}

interface Equipo {
  nombre: string;
  imagen: string;
  liga?: string;
  url: string;
}

const generarCuotas = () => {
  return {
    local: (Math.random() * 2 + 1).toFixed(2),
    empate: (Math.random() * 2 + 2).toFixed(2),
    visita: (Math.random() * 2 + 1).toFixed(2),
  };
};

const FormularioApuesta = ({  }: Props) => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [apuestas, setApuestas] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        const lista = await obtenerEquipos();
        setEquipos(lista);
        setApuestas([
          ...Array(4)
            .fill(null)
            .map(() => ({ ...crearPartidoAleatorio(lista), monto: "" })),
        ]);
      } catch (error) {
        console.error("Error al cargar equipos", error);
      }
    };
    cargarEquipos();
  }, []);

  const crearPartidoAleatorio = (lista: Equipo[]) => {
    let equipo1 = lista[Math.floor(Math.random() * lista.length)];

    while (!equipo1.liga || equipo1.liga.toLowerCase() === "liga") {
      equipo1 = lista[Math.floor(Math.random() * lista.length)];
    }

    const mismaLiga = lista.filter(
      (e) => e.liga === equipo1.liga && e.nombre !== equipo1.nombre
    );

    if (mismaLiga.length === 0) {
      return {
        equipo1,
        equipo2: equipo1,
        fecha: "N/A",
        hora: "N/A",
        cuotas: generarCuotas(),
      };
    }

    const equipo2 = mismaLiga[Math.floor(Math.random() * mismaLiga.length)];

    const ahora = new Date();
    ahora.setHours(ahora.getHours() + Math.floor(Math.random() * 72));
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      equipo1,
      equipo2,
      fecha,
      hora,
      cuotas: generarCuotas(),
    };
  };

  const agregarApuestas = () => {
    const nuevas = [...apuestas];
    nuevas.push({ ...crearPartidoAleatorio(equipos), monto: "" });
    nuevas.push({ ...crearPartidoAleatorio(equipos), monto: "" });
    setApuestas(nuevas);
  };

  return (
    <div className="container">
      <h2 className="mb-4 text-center"> Apuestas Disponibles</h2>
      {apuestas.map((apuesta, i) => (
        <button
          key={i}
          className="card mb-3 shadow-sm p-3 w-100 text-start btn btn-light"
          onClick={() => navigate("/eleccion", { state: { partido: apuesta } })} 
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-center">
              <img
                src={apuesta.equipo1.imagen}
                alt={apuesta.equipo1.nombre}
                style={{ width: 50, height: 50 }}
              />
              <div>{apuesta.equipo1.nombre}</div>
            </div>

            <strong>VS</strong>

            <div className="text-center">
              <img
                src={apuesta.equipo2.imagen}
                alt={apuesta.equipo2.nombre}
                style={{ width: 50, height: 50 }}
              />
              <div>{apuesta.equipo2.nombre}</div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <small className="text-muted">
              {apuesta.equipo1.liga} - {apuesta.fecha} {apuesta.hora}
            </small>
          </div>

          <div className="d-flex justify-content-around mt-2">
            <span className="badge bg-success">Local: {apuesta.cuotas.local}</span>
            <span className="badge bg-warning text-dark">Empate: {apuesta.cuotas.empate}</span>
            <span className="badge bg-danger">Visita: {apuesta.cuotas.visita}</span>
          </div>
        </button>
      ))}

      <div className="d-flex gap-2 mb-3 justify-content-center">
        <button className="btn btn-outline-primary" onClick={agregarApuestas}>
          Ver más apuestas
        </button>
        </div>
    </div>
  );
};

export default FormularioApuesta;
