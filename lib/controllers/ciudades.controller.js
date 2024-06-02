import { isEmpty } from 'lodash';
import mongoose from 'mongoose';
import { ciudadSchema } from '../models/ciudades.schema';

export async function crearCiudad(req, res) {
  // acá mongoose juega de conexión, por lo tanto, ciudadesModel "apunta"
  // a la colección llamada "ciudades" (el nombre está especificado en el esquema)
  // de la base a la cual me conecté
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);

  // así es un insert - en realidad hay distintas formas, esta es una
  // ver https://mongoosejs.com/docs/models.html#constructing-documents

  // paso 1 - creo el documento (pero todavía no está en la BD)
  const nuevaCiudad = new ciudadesModel({
    nombre: req.body.nombre,
    pais: req.body.pais,
    poblacion: Number(req.body.poblacion),
  });
  // paso 2 - lo inserto
  await nuevaCiudad.save();

  // el save le agrega dos cosas al objeto
  // _id: se lo pone mongo
  // __v: se lo pone mongoose
  res.json(nuevaCiudad);
}

function getCondicionesPoblacion(query) {
  const condiciones = {};
  if (query.poblacionMayor) {
    condiciones['$gte'] = Number(query.poblacionMayor);
  }
  if (query.poblacionMenor) {
    condiciones['$lte'] = Number(query.poblacionMenor);
  }
  // por qué no condiciones === {}
  return isEmpty(condiciones) ? undefined : condiciones;
}

export async function getPrimeraCiudad(req, res) {
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);
  const ciudadesEnLaBase = await ciudadesModel.find();
  // por qué conviene siempre pasar toObject: ver el retocado
  const primeraCiudad = ciudadesEnLaBase[0].toObject();
  res.json({
    comoViene: primeraCiudad,
    retocado: { ...primeraCiudad, temperatura: 25 },
  });
}

export async function getCiudadesSimple(req, res) {
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);
  const ciudadesEnLaBase = await ciudadesModel.find();
  // atenti: hay que ejecutar toObject para cada elemento de la lista
  res.json({
    comoViene: ciudadesEnLaBase,
    retocado: ciudadesEnLaBase.map((ciudad) => ({
      ...ciudad.toObject(),
      temperatura: 25,
    })),
  });
}

/*
 * opción con lean:
 *  - gano: performance
 *  - pierdo: posibilidad de modificar o borrar los objetos y afectar a la BD,
 *            se pierde la conexión a la BD
 */
export async function getCiudadesLean(_req, res) {
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);
  const datosDeCiudades = await ciudadesModel.find().lean();
  // acá ya no es necesario pasar toObject
  res.json(datosDeCiudades.map((c) => ({ ...c, temperatura: 25 })));
}

export async function getCiudadesVariante(req, res) {
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);

  // para las opciones de filtro, buscar en la doc de Mongo (no en la de Mongoose)
  // https://www.mongodb.com/docs/manual/reference/operator/query/

  // definición de filtro "fijo"
  // const filtroSencillo = {
  //     // pais: req.query.pais   // lo más sencillo: valor exacto =
  //     pais: { "$gte": req.query.pais },   // operador: mayor o igual >=
  //     poblacion: { "$lte": Number(req.query.poblacionMenor) }  // condicion sobre campo numerico
  // };

  // definición de filtro variable, de acuerdo a los query params que se hayan recibido
  const filtro = {};
  if (req.query.pais) {
    filtro.pais = req.query.pais;
  }
  if (req.query.poblacionMenor) {
    filtro.poblacion = { $lte: Number(req.query.poblacionMenor) };
  }
  // después mirar el "or" en la documentación
  if (req.query.nombreEmpieza) {
    filtro['$or'] = [
      { 'nombre.es': { $regex: '^' + req.query.nombreEmpieza } },
      { nombre: { $regex: '^' + req.query.nombreEmpieza } },
    ];
  }

  // restringir que datos de cada documento, forma 1: 2do parametro del find
  // const datosDeCiudades = await ciudadesModel.find(filtro, { pais: true, _id: false }).lean();
  // res.json(datosDeCiudades);

  // restringir que datos de cada documento, forma 2: postprocesamiento
  // lean: para limpiar la data interna de Mongoose, deja sólo los atributos que están en la colección
  const datosDeCiudades = await ciudadesModel.find(filtro).lean();
  const ciudadesConNombreEnEspaniol = datosDeCiudades.map((ciudad) => ({
    ...ciudad,
    nombre: ciudad.nombre.es || ciudad.nombre,
  }));

  res.json(ciudadesConNombreEnEspaniol);

  // por las dudas: versión *mucho* más potente del find es el aggregate
  // (buscarlo en la doc de Mongo)
}

/*
 * Query params: pais, poblacionMayor, poblacionMenor
 */
export async function getCiudadesTerminado(req, res) {
  const ciudadesModel = mongoose.model('Ciudad', ciudadSchema);
  const filtros = {};
  const condicionesOr = [];
  if (req.query.pais) {
    if (Array.isArray(req.query.pais)) {
      // filtros["$or"] = req.query.pais.map(p => ({ pais: p }));
      condicionesOr.push(req.query.pais.map((p) => ({ pais: p })));
    } else {
      filtros.pais = req.query.pais;
    }
  }
  const condicionesPoblacion = getCondicionesPoblacion(req.query);
  if (condicionesPoblacion) {
    filtros.poblacion = condicionesPoblacion;
  }
  if (req.query.nombreEmpieza) {
    condicionesOr.push([
      { nombre: { $regex: `^${req.query.nombreEmpieza}`, $options: 'i' } },
      { 'nombre.es': { $regex: `^${req.query.nombreEmpieza}`, $options: 'i' } },
    ]);
    // filtros.nombre = {"$regex": `^${req.query.nombreEmpieza}`, "$options": "i"};
  }
  if (condicionesOr.length === 1) {
    filtros['$or'] = condicionesOr[0];
  } else if (condicionesOr.length > 1) {
    filtros['$and'] = condicionesOr.map((cond) => ({ $or: cond }));
  }

  const ciudadesEnLaBase = await ciudadesModel.find(filtros);
  // toObject - alternativa a lean
  const ciudadesConUnNombre = ciudadesEnLaBase.map((c) => ({
    ...c.toObject(),
    nombre: c.nombre.es || c.nombre,
  }));
  res.json(ciudadesConUnNombre);
}
