
import { Server as HTTPServer } from 'http';
import passportSocketIo from 'passport.socketio';
import passport from 'passport';
import socketIO, { Socket } from 'socket.io';
import { IConfig } from './config';
import cookieParser from 'cookie-parser';
import { Store } from 'express-session';
import { IUser } from './models/usersModel';

export const activesSockets = new Set<Socket>();

export let io: socketIO.Server;
export function initializeSocket(config: IConfig, httpServer: HTTPServer, sessionStore: Store){
  const { session_cookie_name, session_secret } = config;
  io = socketIO(httpServer);

  io.use(
    passportSocketIo.authorize({
      passport:     passport,
      key:          session_cookie_name,       // the name of the cookie where express/connect stores its session_id
      secret:       session_secret,       // the session_secret to parse the cookie
      cookieParser: cookieParser as any,       // the same middleware you registrer in express
      store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  }));

  io.on('connection', (socket) => newSocketConnection(socket))
  return io;
}

async function removeSocketConnection(socket: Socket, user: IUser){
  socket.disconnect();
  activesSockets.delete(socket);

  delete user.socket;
  user.status = 'offline';
  await user.save();
  io.emit('user-status-update', {user: user.getSafeUser()});
}

async function newSocketConnection(socket: Socket){
  const user = socket.request.user as IUser;
  user.socket = socket.id;
  user.status = 'online';

  await user.save();

  activesSockets.add(socket);
  //io.on('connection', (socket) => console.log(socket));

  // envoi d'un emit avec la modif de l'objet user pour indiquer le statut online ou offline du user
  console.log("emit [user-status-update] ---> ");
  io.emit('user-status-update', {user: user.getSafeUser()});
  socket.on('disconnect', () => removeSocketConnection(socket, user));
}
