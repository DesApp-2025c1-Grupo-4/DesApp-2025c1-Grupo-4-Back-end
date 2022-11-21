import express from 'express';
import { crearEvento } from '../controllers/eventos.controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.post('/', withErrorHandling(crearEvento));

export default router;
