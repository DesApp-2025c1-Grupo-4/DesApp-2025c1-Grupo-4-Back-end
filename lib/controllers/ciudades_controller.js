const ciudadesFijas = [
  { nombre: 'Buenos Aires', pais: 'Argentina', poblacion: 14000000 },
  { nombre: 'Rosario', pais: 'Argentina', poblacion: 3200000 },
  { nombre: 'Graniti', pais: 'Italia', poblacion: 1500 },
  {
    nombre: { es: 'Marsella', fr: 'Marseille' },
    pais: 'Francia',
    poblacion: 2300000,
  },
  {
    nombre: { es: 'Ginebra', fr: 'Genève', en: 'Geneva' },
    pais: 'Suiza',
    poblacion: 1030000,
  },
];

export const getCiudades = async (req, res) => {
  const nombrePais = req.query.pais;
  const idiomaPreferido = req.headers.idioma;
  const ciudadesSeleccionadas = nombrePais
    ? ciudadesFijas.filter((ciudad) => ciudad.pais === nombrePais)
    : ciudadesFijas;
  const ciudadesEnIdiomaPreferido = ciudadesSeleccionadas.map((ciudad) => {
    const nombre =
      typeof ciudad.nombre === 'string'
        ? ciudad.nombre
        : ciudad.nombre[idiomaPreferido] || ciudad.nombre.es;
    return { ...ciudad, nombre };
  });
  res.json(ciudadesEnIdiomaPreferido);
};

export const getCiudad = async (req, res) => {
  const nombreSolicitado = req.params.nombre;
  const idiomaPreferido = req.headers.idioma || "es";
  const datosDeLaCiudad = ciudadesFijas.find(
    (ciudad) => ciudad.nombre === nombreSolicitado || ciudad.nombre[idiomaPreferido] === nombreSolicitado
  );
  if (datosDeLaCiudad) {
    res.json(datosDeLaCiudad);
  } else {
    res.status(404);
    res.json({ message: 'No hay registros sobre la ciudad solicitada' });
  }
};
