import { IUser, User } from './../models/usersModel';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserNotFoundError } from './errors/userNotFoundError';

passport.use( // statégie pour savoir si un user est bien connecté
    new Strategy((username: string, password: string, done) => {
        User.findOne({ email: username }, (err, user) => {
            if (err) return done(err);

            if (user) {
                const correctPassword = user.verifyPassword(password);
                if (correctPassword) return done(null, user);
            }

            return done(new UserNotFoundError(username, 'User not found'))
        });
    })

);

passport.serializeUser((user: IUser, done) => { // injection dans la session
    done(null, user._id)
});

passport.deserializeUser((id: string, done) => { // injection du user dans le navigateur
    User.findById(id, (err, user) => {
        if (err) done(err);

        return done(null, user);
    });
});

// ces 2 fonctions sont utilisées comme middleware pour faire le lien entre passport et session
export const authenticationInitialize = () => passport.initialize();
export const authenticationSession = () => passport.session();