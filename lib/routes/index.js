import express from 'express';
import ciudades from './ciudades';
import eventos from './eventos';

const router = express.Router();

router.use('/api/ciudades', ciudades);
router.use('/api/eventos', eventos);

export default router;
