import express from 'express';
import {signin, Signup,google,signOut} from '../controllers/authcontroller.js'
const router = express.Router();
router.post('/signup',Signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signOut)



export default router;