import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerLigas } from "../services/ligaService";
import { obtenerApuestas } from "../services/apuestaService";
import FormularioApuesta from "./FormularioApuesta";

interface Liga {
  nombre: string;
  imagen: string;
  url: string;
}

interface Apuesta {
  id: number;
  partido: string;
  cuotaLocal: number;
  cuotaEmpate: number;
  cuotaVisita: number;
}

interface Props {
  usuarioActivo: any;
  setUsuarioActivo: (usuario: any) => void;
}

const Home = ({ usuarioActivo, setUsuarioActivo }: Props) => {
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [,setApuestas] = useState<Apuesta[]>([]);
  const [verMasPreguntas, setVerMasPreguntas] = useState(false);
  const [verMasLigas, setVerMasLigas] = useState(false);
  const [preguntasAbiertas, setPreguntasAbiertas] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioActivo) {
      navigate("/"); 
    }
  }, [usuarioActivo, navigate]);

  useEffect(() => {
    const cargarDatos = async () => {
      const ligasData = await obtenerLigas();
      const apuestasData = await obtenerApuestas();
      setLigas(ligasData);
      setApuestas(apuestasData);
    };
    cargarDatos();
  }, []);

  const preguntas = [
    { id: 1, texto: "¿Cómo puedo realizar una apuesta?", respuesta: "Para realizar una apuesta, selecciona un partido y elige una cuota." },
    { id: 2, texto: "¿Dónde veo mi historial de apuestas?", respuesta: "Puedes ver tu historial en la sección Historial en el menú superior." },
    { id: 3, texto: "¿Puedo editar o eliminar una apuesta?", respuesta: "No, una vez realizada la apuesta no puede ser modificada." },
    { id: 4, texto: "¿Cómo se calculan las cuotas?", respuesta: "Las cuotas se basan en estadísticas y algoritmos de probabilidad." },
    { id: 5, texto: "¿Qué métodos de pago están disponibles?", respuesta: "Aceptamos tarjetas, Yape y transferencias bancarias." },
    { id: 6, texto: "¿Cómo retiro mis ganancias?", respuesta: "Ve a tu perfil y selecciona la opción Retirar saldo." },
  ];

  const preguntasMostradas = verMasPreguntas ? preguntas : preguntas.slice(0, 3);

  const togglePregunta = (id: number) => {
    setPreguntasAbiertas((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="container-fluid px-4 py-4 bg-light text-dark">
      {/* Carrusel */}
      <div id="carouselExample" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner rounded shadow">
          {["cartel1.avif", "cartel2.jpg", "cartel3.jpg", "cartel4.webp"].map((img, i) => (
            <div key={img} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={`/img/${img}`}
                className="d-block w-100"
                alt={`banner-${i}`}
                style={{ height: "300px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        {/* Ligas */}
        <div className="col-md-3 mb-4">
          <h4 className="mb-3 text-center">Ligas</h4>
          <ul className="list-group">
            {(verMasLigas ? ligas : ligas.slice(0, 3)).map((liga) => (
              <li key={liga.nombre} className="list-group-item p-0">
                <Link
                  to={liga.url}
                  className="btn w-100 text-start d-flex align-items-center"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={liga.imagen}
                    alt={liga.nombre}
                    className="me-2"
                    style={{ height: "50px", width: "auto", objectFit: "contain" }}
                  />
                  <strong>{liga.nombre}</strong>
                </Link>
              </li>
            ))}
          </ul>
          {ligas.length > 3 && (
            <div className="mt-2 d-grid">
              <button
                className="btn btn-link btn-sm"
                onClick={() => setVerMasLigas(!verMasLigas)}
              >
                {verMasLigas ? "Ver menos ▲" : "Ver más ▼"}
              </button>
            </div>
          )}
        </div>

        
        <div className="col-md-6 mb-4">
          {usuarioActivo ? (
            <FormularioApuesta
              usuarioActivo={usuarioActivo}
              setUsuarioActivo={setUsuarioActivo}
            />
          ) : (
            <div className="text-center p-4 border rounded bg-white shadow-sm">
              <p className="mb-3">Debes iniciar sesión para realizar apuestas.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Ir al login
              </button>
            </div>
          )}
        </div>


        {/* Preguntas frecuentes */}
        <div className="col-md-3 mb-4">
          <h4 className="mb-3 text-center">Preguntas frecuentes</h4>
          <ul className="list-group">
            {preguntasMostradas.map((pregunta) => (
              <li key={pregunta.id} className="list-group-item">
                <button
                  className="btn btn-link text-start w-100"
                  onClick={() => togglePregunta(pregunta.id)}
                  style={{ textDecoration: "none" }}
                >
                  {pregunta.texto}
                </button>
                {preguntasAbiertas.includes(pregunta.id) && (
                  <div className="mt-2 text-muted">
                    {pregunta.respuesta}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {preguntas.length > 3 && (
            <div className="mt-2 text-center">
              <button
                className="btn btn-link btn-sm"
                onClick={() => setVerMasPreguntas(!verMasPreguntas)}
              >
                {verMasPreguntas ? "Ver menos ▲" : "Ver más ▼"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
