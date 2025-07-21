import { useState } from "react";
import { actualizarUsuario } from "../services/usuarioService";

interface Props {
  setUsuarioActivo: (usuario: any) => void;
}

const Recargar = ({ setUsuarioActivo }: Props) => {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvc, setCvc] = useState("");
  const [monto, setMonto] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tarjetaLimpia = tarjeta.replace(/\s/g, "");
    const tarjetaValida = /^\d{16}$/.test(tarjetaLimpia);
    const fechaValida = /^\d{2}\/\d{2}$/.test(fecha);
    const cvcValido = /^\d{3}$/.test(cvc);
    const montoNum = parseFloat(monto);
    const montoValido = !isNaN(montoNum) && montoNum > 0 && montoNum <= 10000;

    if (!tarjetaValida) return alert("Número de tarjeta inválido.");
    if (!fechaValida) return alert("Fecha inválida. Usa MM/YY.");
    if (!cvcValido) return alert("CVC inválido.");
    if (!montoValido) return alert("Monto inválido.");

    const userStr = localStorage.getItem("usuarioActivo");
    if (!userStr) return alert("Sesión no encontrada.");

    const user = JSON.parse(userStr);
    const nuevoSaldo = (user.saldo || 0) + montoNum;

    try {
      const actualizado = await actualizarUsuario(user.id, { saldo: nuevoSaldo });
      localStorage.setItem("usuarioActivo", JSON.stringify(actualizado));
      setUsuarioActivo(actualizado);

      alert(`Recargaste S/. ${montoNum.toFixed(2)} correctamente`);
      setTarjeta("");
      setFecha("");
      setCvc("");
      setMonto("");
    } catch (error) {
      console.error("Error al actualizar saldo en el servidor:", error);
      alert("No se pudo actualizar el saldo en el servidor.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h4 className="text-center mb-4 fw-bold text-primary">Recargar Saldo</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Número de tarjeta</label>
            <input
              type="text"
              maxLength={19}
              inputMode="numeric"
              className="form-control"
              value={tarjeta}
              onChange={(e) => {
                let valor = e.target.value.replace(/\D/g, "");
                if (valor.length > 16) valor = valor.slice(0, 16);
                let valorFormateado = "";
                for (let i = 0; i < valor.length; i++) {
                  if (i > 0 && i % 4 === 0) valorFormateado += " ";
                  valorFormateado += valor[i];
                }
                setTarjeta(valorFormateado);
              }}
              placeholder="4242 1234 5678 9010"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Fecha (MM/YY)</label>
            <input
              type="text"
              maxLength={5}
              className="form-control"
              value={fecha}
              onChange={(e) =>
                setFecha(
                  e.target.value
                    .replace(/[^\d]/g, "")
                    .replace(/(\d{2})(\d{1,2})/, "$1/$2")
                    .slice(0, 5)
                )
              }
              placeholder="MM/YY"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CVC</label>
            <input
              type="text"
              maxLength={3}
              inputMode="numeric"
              className="form-control"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
              placeholder="123"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Monto (S/.)</label>
            <input
              type="number"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              min="10"
              max="10000"
              step="1"
              placeholder="Min. 10 soles, Max. 10 000 soles"
            />
          </div>

          <button className="btn btn-primary w-100 fw-bold" type="submit">
            Recargar
          </button>
        </form>
      </div>
    </div>

  );
};

export default Recargar;
