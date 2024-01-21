import express from 'express';
import { generateSignature } from '../controllers/signatureController.js';

const signatureRouter = express.Router();

signatureRouter.post('/', generateSignature);

export { signatureRouter };
