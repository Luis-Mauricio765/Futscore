const API_URL = "http://localhost:3001/equipos";

export const obtenerEquipoPorNombre = async (nombre: string) => {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Error al obtener equipo");
  }

  const data = await response.json();
  const nombreLower = nombre.toLowerCase();

  const encontrado = data.find((equipo: any) =>
    equipo.nombre.toLowerCase() === nombreLower
  );

  return encontrado || null;
};

export const obtenerEquipos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener equipos");
  }
  return await response.json();
};
