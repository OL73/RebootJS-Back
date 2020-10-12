import { Router } from 'express'; // pour pouvoir utiliser les routes
import usersRoutes from "./usersRoutes";
import loginRoutes from './loginRoutes';

const router = Router();

// redirection vers usersRoutes
router.use('/users', usersRoutes);

// redirection vers login
router.use('login', loginRoutes);

export default router;