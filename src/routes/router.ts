import { Router } from 'express'; // pour pouvoir utiliser les routes
import usersRoutes from "./usersRoutes";
import loginRoutes from './loginRoutes';
import messagesRoutes from './messagesRoutes';

const router = Router();

// redirection vers usersRoutes
router.use('/users', usersRoutes);

// redirection vers login
router.use('/login', loginRoutes);

// vers messages
router.use('/messages', messagesRoutes);

export default router;