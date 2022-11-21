import express from 'express';
import ciudades from './ciudades';
import ciudades_mongo from './ciudades_mongo';
import eventos from './eventos';

const router = express.Router();

router.use('/api/ciudades', ciudades);
router.use('/api/ciudades_mongo', ciudades_mongo);
router.use('/api/eventos', eventos);

export default router;
