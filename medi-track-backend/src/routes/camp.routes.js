import { Router } from 'express';
import {
  createCamp,
  getCamps,
  getCampById,
  joincamp,
  updateCampStatus,
} from '../controllers/camp.controller.js';
import { verifyJWT, checkRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Create camp (admin only)
router.post('/', verifyJWT, checkRole('admin'), createCamp);

// Get all camps (public)
router.get('/', getCamps);

// Get camp by ID (public)
router.get('/:id', getCampById);

// Join camp as doctor (doctor only)
router.patch('/:id/join', verifyJWT, checkRole('doctor'), joincamp);

// Update camp status (admin only)
router.patch('/:id/status', verifyJWT, checkRole('admin'), updateCampStatus);

export default router;
