import mongoose, { Types } from "mongoose";
import { eventoSchema } from "../models/eventos.schema";

export async function crearEvento(req, res) {
    const eventosModel = mongoose.model('Evento', eventoSchema);
    const nuevoEvento = new eventosModel({ 
        ciudad: Types.ObjectId(req.body.ciudad),
        fecha: req.body.fecha || "2022.08.01",
        data: req.body.data,
    });
    await nuevoEvento.save();
    res.json(nuevoEvento);
};
