import mongoose, { Schema } from "mongoose";

export const ciudadSchema = new mongoose.Schema(
    {
        // nombre: { type: String, required: true },
        nombre: Schema.Types.Mixed,   // para poder poner cualquier valor y que Mongoose no se meta
        // hay millones de opciones de configuracion de un atributo
        // ver https://mongoosejs.com/docs/schematypes.html#schematype-options
        pais: { type: String, required: true, minLength: 3, maxLength: 500 },
        poblacion: {type: Number, max: 200000000},
    }, 
    { collection: 'ciudades' }
);
