import { IUser, User } from "../models/usersModel";
import { DatabaseError } from './errors/databaseErrors';

function createUser(firstname: string, lastname: string, email: string): IUser | undefined {
  const user = new User({ firstname, lastname, email });

  try {
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

export {
  createUser,
  getUser,
  getUsers
}