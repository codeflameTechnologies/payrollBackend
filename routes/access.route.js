import express from 'express';
import {
  createAccess,
  getAllAccess,
  getAccessById,
  updateAccess,
  deleteAccess,
  requestMemberLoginOtp,
  verifyMemberLoginOtp,
} from '../controller/access.controller.js';
import { jwtVerify } from '../middleware/jwtVerify.js';
import { adminVerify } from '../middleware/adminVerify.js';

const router = express.Router();

router.post('/request-otp', requestMemberLoginOtp);
router.post('/verify-otp', verifyMemberLoginOtp);

router.use(jwtVerify);
router.use(adminVerify);

router.get('/', getAllAccess);
router.post('/', createAccess);
router.get('/:id', getAccessById);
router.put('/:id', updateAccess);
router.delete('/:id', deleteAccess);

export default router;
