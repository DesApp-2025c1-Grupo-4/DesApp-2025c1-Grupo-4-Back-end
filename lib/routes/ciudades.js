import express from 'express';
import {
  crearCiudad,
  getCiudadesLean,
  getCiudadesSimple,
  getCiudadesTerminado,
  getCiudadesVariante,
} from '../controllers/ciudades.controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.post('/', withErrorHandling(crearCiudad));
router.get('/', withErrorHandling(getCiudadesTerminado));
router.get('/lean', withErrorHandling(getCiudadesLean));
router.get('/simple', withErrorHandling(getCiudadesSimple));
router.get('/variante', withErrorHandling(getCiudadesVariante));

export default router;
