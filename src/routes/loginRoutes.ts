import { Request, Response, Router } from 'express';
import passport from 'passport';
import { UserNotFoundError } from '../controllers/errors/userNotFoundError';

const router = Router();

router.get('/logout', (req: Request, res: Response) => {

    req.logOut();
    req.session?.destroy((err) => {
        res.redirect('/');
    });
});

router.post('/', (req: Request, res: Response) => {                                 // on rentre dans Stategy.use
    const authenticationFunction = passport.authenticate('local', (err, user) => { // 'local' = propre authentification, pas via FB, google ou autre
        if (err) {
            if (err instanceof UserNotFoundError) return res.status(404).send('User not found');

            return res.status(500).send();
        }

        if (user) { // enregistrement des infos dans la session
            req.logIn(user, err => {
                if (err) return res.status(500).send();
                return res.send(user.getSafeUser()); // renvoie un cookie (set-cookie) dans le header
            });
        } else {
            return res.status(404).send('User not found');
        }

    }); // renvoie une fonction qui prend en paramètre req et res

    return authenticationFunction(req, res);
});

export default router;