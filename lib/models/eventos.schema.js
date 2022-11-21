import mongoose, { Schema } from "mongoose";

export const eventoSchema = new mongoose.Schema({
    ciudad: { type: Schema.Types.ObjectId, ref: "Ciudad"},
    fecha: String,
    data: Schema.Types.Mixed,
}, { collection: 'eventos'});

