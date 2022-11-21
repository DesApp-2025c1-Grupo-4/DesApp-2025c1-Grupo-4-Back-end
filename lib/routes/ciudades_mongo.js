import express from 'express';
import { crearCiudad, getCiudades, getCiudadesLean, getCiudadesSimple, getCiudadesTerminado } from '../controllers/ciudades.mongo.controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.post('/', withErrorHandling(crearCiudad));
router.get('/', withErrorHandling(getCiudadesTerminado));
router.get('/lean', withErrorHandling(getCiudadesLean));
router.get('/simple', withErrorHandling(getCiudadesSimple));
router.get('/enProceso', withErrorHandling(getCiudades));

export default router;
