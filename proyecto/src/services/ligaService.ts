const API_URL = "http://localhost:3001/ligas";

export const obtenerLigas = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener ligas");
  }
  return await response.json();
};

export const obtenerLigaPorNombre = async (nombre: string) => {
  const response = await fetch(`${API_URL}?nombre_like=${encodeURIComponent(nombre)}`);
  if (!response.ok) {
    throw new Error("Error al buscar liga");
  }
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
};
