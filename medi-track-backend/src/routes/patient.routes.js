import { Router } from 'express';
import {
  registerPatient,
  getPatientsByCamp,
  updatePatient,
} from '../controllers/patient.controller.js';
import { verifyJWT, checkRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Register patient (patient, doctor or admin)
router.post('/', verifyJWT, checkRole('patient', 'doctor', 'admin'), registerPatient);

// Get patients by camp (public, paginated)
router.get('/camp/:campId', getPatientsByCamp);

// Update patient (doctor or admin)
router.patch('/:id', verifyJWT, checkRole('doctor', 'admin'), updatePatient);

export default router;
