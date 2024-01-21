import express from 'express';
import {
  generateSignature,
  handleFileUpload,
} from '../controllers/signatureController.js';

const signatureRouter = express.Router();

signatureRouter.post('/', generateSignature);

export { signatureRouter };
