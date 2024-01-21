import express from 'express';
import { handleFileUpload } from '../controllers/signatureController.js';

const fileRouter = express.Router();

fileRouter.post('/upload', handleFileUpload);

export { fileRouter };
