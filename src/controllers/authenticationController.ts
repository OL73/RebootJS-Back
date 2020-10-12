import { IUser, User } from './../models/usersModel';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserNotFoundError } from './errors/userNotFoundError';

passport.use(
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

passport.serializeUser((user: IUser, done) => {
    done(null, user._id)
});

passport.deserializeUser((id: string, done) => {
    User.findById(id, (err, user) => {
        if (err) done(err);

        return done(null, user);
    });
});

export const authenticationInitialize = () => passport.initialize();
export const authenticationSession = () => passport.session();