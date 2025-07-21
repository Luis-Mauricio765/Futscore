const API_URL = "http://localhost:3001/usuarios";

export const obtenerUsuarios = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
};

export const loginUsuario = async (nombre: string, password: string) => {
  const res = await fetch(`${API_URL}?nombre=${nombre}&password=${password}`);
  if (!res.ok) throw new Error("Error al intentar iniciar sesión");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};

export const crearUsuario = async (usuario: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return await res.json();
};

export const actualizarUsuario = async (id: number, cambios: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return await res.json();
};
