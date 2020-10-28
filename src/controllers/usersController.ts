import { IUser, User } from "../models/usersModel";
import { DatabaseError } from './errors/databaseErrors';

function createUser(firstname: string, lastname: string, email: string, password: string): IUser | undefined {

  try {
    const user = new User({ firstname, lastname, email, password });

    user.setPassword(password);

    user.save();

    return user;

  } catch (ex) {
    console.log(ex);
  }
}

function getUser(id: string, callback: (user: IUser | null) => void): void {
  //return existingUsers.find(user => user.id === id);
  User.findById(id, (err, res) => {
    if (err) { throw new DatabaseError(err) }

    callback(res);
  });

}

function getUsers(): any {

  try {

    return User.find();

  } catch (ex) {
    console.log(ex);
  }

}

function updateConversationSeen(user: IUser, conversationId: string): Promise<IUser>{
  user.conversationsSeen = {
    ...user.conversationsSeen,
    [conversationId]: new Date()
  }
  return user.save()
}

export {
  createUser,
  getUser,
  getUsers,
  updateConversationSeen
}