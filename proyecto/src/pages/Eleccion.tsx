import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { actualizarSaldoUsuario, guardarApuesta } from "../services/apuestaService";

const Eleccion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const partido = location.state?.partido;

  const [usuario, setUsuario] = useState<any>(null);
  const [opciones, setOpciones] = useState({
    seleccionGanador: "",
    dobleOportunidad: "",
    ambosMarcan: "",
    goles: "",
    corners: "",
    tarjetas: "",
    monto: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    setUsuario(user);
  }, []);

  if (!partido) return <div>No se ha seleccionado ningún partido.</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    setOpciones((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpciones((prev) => ({
      ...prev,
      monto: e.target.value,
    }));
  };    

  const apostar = async () => {
    const { monto, ...opcionesSinMonto } = opciones;
        const algunaSeleccion = Object.values(opcionesSinMonto).some(v => v !== "");

        if (!algunaSeleccion) {
            alert("Selecciona al menos una opción de apuesta.");
            return;
        }
    if (!usuario) {
      alert("Debes iniciar sesión para apostar.");
      navigate("/login");
      return;
    }

    if (!opciones.monto || parseFloat(opciones.monto) <= 0) {
      alert("Ingresa un monto válido para apostar.");
      return;
    }

    if (parseFloat(opciones.monto) > usuario.saldo) {
      alert("No tienes saldo suficiente.");
      return;
    }

    const apuestaGuardada = {
      usuario: usuario.nombre,
      equipo1: partido.equipo1,
      equipo2: partido.equipo2,
      opciones,
      monto: opciones.monto,
      fechaHoraApuesta: new Date().toISOString(),
    };

    try {
      await guardarApuesta(apuestaGuardada);

      const nuevoSaldo = usuario.saldo - parseFloat(opciones.monto);
      await actualizarSaldoUsuario(usuario.id, nuevoSaldo)

      const usuarioActualizado = { ...usuario, saldo: nuevoSaldo };
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);

      alert("Apuesta confirmada!");
      navigate("/formulario-apuesta");
    } catch (error) {
      console.error("Error al guardar la apuesta", error);
      alert("No se pudo confirmar la apuesta.");
    }
  };

  const renderSelectOptions = (opcionesArray: any[] = [], tipo: string) => {
    let adicionales: { valor: string; etiqueta: string; cuota: number }[] = [];

    if (tipo === "goles") {
      adicionales = [
        { valor: "+3.5", etiqueta: "Más de 3.5", cuota: 2.5 },
        { valor: "-3.5", etiqueta: "Menos de 3.5", cuota: 1.5 },
      ];
    } else if (tipo === "corners") {
      adicionales = [
        { valor: "+10.5", etiqueta: "Más de 10.5", cuota: 2.0 },
        { valor: "-10.5", etiqueta: "Menos de 10.5", cuota: 1.8 },
      ];
    } else if (tipo === "tarjetas") {
      adicionales = [
        { valor: "+4.5", etiqueta: "Más de 4.5", cuota: 2.2 },
        { valor: "-4.5", etiqueta: "Menos de 4.5", cuota: 1.6 },
      ];
    }

    const todasLasOpciones = Array.isArray(opcionesArray)
      ? [...opcionesArray, ...adicionales]
      : adicionales;

    return todasLasOpciones.map((opcion, index) => (
      <option key={index} value={opcion.valor}>
        {opcion.etiqueta} ({opcion.cuota.toFixed(2)})
      </option>
    ));
  };
    return (
        <div className="container mt-4">

            <div className="card p-3 mb-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-center">
                        <img src={partido.equipo1.imagen} alt={partido.equipo1.nombre} style={{ width: 50 }} />
                        <div>{partido.equipo1.nombre}</div>
                    </div>
                    <strong>VS</strong>
                    <div className="text-center">
                        <img src={partido.equipo2.imagen} alt={partido.equipo2.nombre} style={{ width: 50 }} />
                        <div>{partido.equipo2.nombre}</div>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <small className="text-muted">
                        {partido.equipo1.liga} - {partido.fecha} {partido.hora}
                    </small>
                </div>
            </div>

            <div className="container mt-5">
                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">1x2</h6>

                    <div className="d-flex justify-content-between gap-2">
                        {/* LOCAL */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`seleccionGanador`}
                            id={`local-${partido.id}`}
                            autoComplete="off"
                            value="local"
                            onChange={handleChange}
                            checked={opciones.seleccionGanador === "local"}
                        />
                        <label
                            className={`btn border rounded px-3 py-2 text-start flex-fill ${opciones.seleccionGanador === "local" ? "btn-dark active" : "btn-outline-dark"
                                }`}
                            htmlFor={`local-${partido.id}`}
                        >
                            <div className="fw-normal">{partido.equipo1?.nombre ?? "Equipo A"}</div>
                            <div className="fw-bold">{partido.cuotaLocal?.toFixed(2) ?? "--"}</div>
                        </label>

                        {/* EMPATE */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`seleccionGanador`}
                            id={`empate-${partido.id}`}
                            value="empate"
                            onChange={handleChange}
                            checked={opciones.seleccionGanador === "empate"}
                        />
                        <label
                            className={`btn border rounded px-3 py-2 flex-fill ${opciones.seleccionGanador === "empate" ? "btn-dark active" : "btn-outline-dark"
                                }`}
                            htmlFor={`empate-${partido.id}`}
                        >
                            <div className="fw-normal">Empate</div>
                            <div className="fw-bold">{partido.cuotaEmpate?.toFixed(2) ?? "--"}</div>
                        </label>

                        {/* VISITA */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`seleccionGanador`}
                            id={`visita-${partido.id}`}
                            value="visita"
                            onChange={handleChange}
                            checked={opciones.seleccionGanador === "visita"}
                        />
                        <label
                            className={`btn border rounded px-3 py-2 text-end flex-fill ${opciones.seleccionGanador === "visita" ? "btn-dark active" : "btn-outline-dark"
                                }`}
                            htmlFor={`visita-${partido.id}`}
                        >
                            <div className="fw-normal">{partido.equipo2?.nombre ?? "Equipo B"}</div>
                            <div className="fw-bold">{partido.cuotaVisita?.toFixed(2) ?? "--"}</div>
                        </label>
                    </div>
                </div>

                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">Doble Oportunidad</h6>
                    <div className="d-flex justify-content-between gap-2">
                        {/* 1X */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`dobleOportunidad`}
                            id={`1X-${partido.id}`}
                            value="1X"
                            onChange={handleChange}
                            checked={opciones.dobleOportunidad === "1X"}
                        />
                        <label
                            className="btn btn-outline-dark border rounded px-3 py-2 text-start flex-fill"
                            htmlFor={`1X-${partido.id}`}
                        >
                            <div className="fw-normal">1X</div>
                            <div className="fw-bold">{partido.cuota1X?.toFixed(2) ?? "--"}</div>
                        </label>

                        {/* 12 */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`dobleOportunidad`}
                            id={`12-${partido.id}`}
                            value="12"
                            onChange={handleChange}
                            checked={opciones.dobleOportunidad === "12"}
                        />
                        <label
                            className="btn btn-outline-dark border rounded px-3 py-2 flex-fill"
                            htmlFor={`12-${partido.id}`}
                        >
                            <div className="fw-normal">12</div>
                            <div className="fw-bold">{partido.cuota12?.toFixed(2) ?? "--"}</div>
                        </label>

                        {/* X2 */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`dobleOportunidad`}
                            id={`X2-${partido.id}`}
                            value="X2"
                            onChange={handleChange}
                            checked={opciones.dobleOportunidad === "X2"}
                        />
                        <label
                            className="btn btn-outline-dark border rounded px-3 py-2 text-end flex-fill"
                            htmlFor={`X2-${partido.id}`}
                        >
                            <div className="fw-normal">X2</div>
                            <div className="fw-bold">{partido.cuotaX2?.toFixed(2) ?? "--"}</div>
                        </label>

                    </div>
                </div>

                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">Ambos Marcan</h6>
                    <div className="d-flex justify-content-between gap-2">
                        {/* Sí */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`ambosMarcan`}
                            id={`siAmbos-${partido.id}`}
                            value="si"
                            onChange={handleChange}
                            checked={opciones.ambosMarcan === "si"}
                        />
                        <label
                            className="btn btn-outline-dark border rounded px-3 py-2 text-start flex-fill"
                            htmlFor={`siAmbos-${partido.id}`}
                        >
                            <div className="fw-normal">Sí</div>
                            <div className="fw-bold">{partido.cuotaAmbosSi?.toFixed(2) ?? "--"}</div>
                        </label>

                        {/* No */}
                        <input
                            type="radio"
                            className="btn-check"
                            name={`ambosMarcan`}
                            id={`noAmbos-${partido.id}`}
                            value="no"
                            onChange={handleChange}
                            checked={opciones.ambosMarcan === "no"}
                        />
                        <label
                            className="btn btn-outline-dark border rounded px-3 py-2 text-end flex-fill"
                            htmlFor={`noAmbos-${partido.id}`}
                        >
                            <div className="fw-normal">No</div>
                            <div className="fw-bold">{partido.cuotaAmbosNo?.toFixed(2) ?? "--"}</div>
                        </label>
                    </div>
                </div>

                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">Total de Goles</h6>
                    <div className="mb-2">
                        <label className="form-label">Selecciona el total:</label>
                        <select
                            className="form-select"
                            name="goles"
                            value={opciones.goles}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccionar --</option>
                            {renderSelectOptions(partido.opcionesGoles, "goles")}
                        </select>
                    </div>
                </div>

                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">Total de Corners</h6>
                    <div className="mb-2">
                        <label className="form-label">Selecciona el total:</label>
                        <select
                            className="form-select"
                            name="corners"
                            value={opciones.corners}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccionar --</option>
                            {renderSelectOptions(partido.opcionesCorners, "corners")}
                        </select>
                    </div>
                </div>

                <div className="card border rounded shadow-sm p-3 mb-4">
                    <h6 className="fw-bold mb-3">Total de Tarjetas Amarillas</h6>
                    <div className="mb-2">
                        <label className="form-label">Selecciona el total:</label>
                        <select
                            className="form-select"
                            name="tarjetas"
                            value={opciones.tarjetas}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccionar --</option>
                            {renderSelectOptions(partido.opcionesTarjetas, "tarjetas")}
                        </select>
                    </div>
                </div>

                <div className="d-flex align-items-end gap-3 mb-4">
                    <div className="flex-grow-1 w-50">
                        <label className="fw-bold">Monto a apostar (S/.)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            className="form-control"
                            name="monto"
                            value={opciones.monto}
                            onChange={handleMontoChange}
                        />
                    </div>
                    <div>
                        <button className="btn btn-success w-100" onClick={apostar}>
                            Confirmar Apuesta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Eleccion;

