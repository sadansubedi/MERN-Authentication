import express from 'express';
import {test,updateUser,deleteUser} from '../controllers/usercontroller.js'
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test',test)
router.post('/update/:id',verifyToken,updateUser);//first check verifyToken if correct then next updateUser 
router.delete('/delete/:id',verifyToken,deleteUser)//delete user is like deleting account forever meanwhile signout means right now logout types 


export default router;