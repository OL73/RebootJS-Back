import { Router } from 'express'; // pour pouvoir utiliser les routes
import usersRoutes from "./usersRoutes";

const router = Router();

// redirection vers usersRoutes
router.use('/users', usersRoutes);

export default router;