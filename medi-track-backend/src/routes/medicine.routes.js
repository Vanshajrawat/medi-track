import { Router } from 'express';
import {
  addMedicine,
  dispenseMedicine,
  getMedicinesBycamp,
} from '../controllers/medicine.controller.js';
import { verifyJWT, checkRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Add medicine (admin only)
router.post('/', verifyJWT, checkRole('admin'), addMedicine);

// Dispense medicine (admin or doctor)
router.patch('/:id/dispense', verifyJWT, checkRole('admin', 'doctor'), dispenseMedicine);

// Get medicines by camp (public)
router.get('/camp/:campId', getMedicinesBycamp);

export default router;
