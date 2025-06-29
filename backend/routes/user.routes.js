import express, { Router } from 'express'
import { login, register, verifyEmail } from '../controllers/user.controller.js';

const router= Router();

router.route('/register').post(register);
router.route('/verify-email').post(verifyEmail);
router.route('/login').get(login);

export default router;