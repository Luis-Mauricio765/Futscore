const API_URL = "http://localhost:3001";

export interface Apuesta {
  id?: number;
  usuario: string;
  equipo1: { nombre: string; imagen: string };
  equipo2: { nombre: string; imagen: string };
  opciones: any;
  monto: string;
  fechaHoraApuesta: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  saldo: number;
}

export const obtenerApuestas = async (): Promise<Apuesta[]> => {
  const res = await fetch(`${API_URL}/apuestas`);
  if (!res.ok) throw new Error("Error al obtener apuestas");
  return res.json();
};

export const guardarApuesta = async (apuesta: any) => {
  const res = await fetch(`${API_URL}/apuestas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apuesta),
  });
  if (!res.ok) throw new Error("Error guardando apuesta");
  return res.json();
};

export const obtenerApuestasPorUsuario = async (usuario: string) => {
  const res = await fetch(`${API_URL}/apuestas?usuario=${encodeURIComponent(usuario)}`);
  if (!res.ok) throw new Error("Error al obtener apuestas por usuario");
  return res.json();
};

export const eliminarApuestaPorId = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/apuestas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar apuesta");
};

export const actualizarSaldoUsuario = async (
  usuarioId: number,
  nuevoSaldo: number
): Promise<Usuario> => {
  const res = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ saldo: nuevoSaldo }),
  });
  if (!res.ok) throw new Error("Error al actualizar saldo");
  return res.json();
};

export const obtenerUsuarioPorNombre = async (
  nombre: string
): Promise<Usuario | null> => {
  const res = await fetch(`${API_URL}/usuarios?nombre=${encodeURIComponent(nombre)}`);
  if (!res.ok) throw new Error("Error al obtener usuario");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};
