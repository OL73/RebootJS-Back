import Joi from "joi";
/* // TODO transformer en Typescript
class User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  static last_id = 0;

  constructor(firstname: string, lastname: string, email: string){
    User.last_id += 1;
    this.id = User.last_id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
  }

  status(){
    return `Je m'appelle ${this.firstname} ${this.lastname} et suis joignable sur ${this.email}`;
  }

  changeLastname(newName: string){
    this.lastname = newName
  }

  changeFirstname(newFirstname: string){
    this.firstname = newFirstname;
  }
}

const existingUsers = [
  new User('Thomas', 'Falcone', 'thomas.falcone@mail.com'),
  new User('Philippa', 'Dupont', 'mail@mail.mail')
]

export { User, existingUsers } */

// création du moule User avec Mongoose
import { Document, Schema, Model, model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  /* status: () => string; */
}

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    lowercase: true
  },
  lastname: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
});

/* userSchema.methods.status = function () {
  return `${this.firstname} ${this.lastname}`;
} */

export const User = model<IUser, Model<IUser>>('User', userSchema);

/* const newUser = new User;
newUser.status(); */

export function validationUser(user: any) {

  const schema = Joi.object({
    firstname: Joi.string().min(3).max(50).required(),
    lastname: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}