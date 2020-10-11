import { IUser } from './../models/usersModel';
import { Request, Response, Router } from 'express';
import { createUser, getUser, getUsers } from '../controllers/usersController';
import { User } from '../models/usersModel';

const router = Router();

// uri finale = /api/users/:userId, cf ligne "app.use('/users', usersRoutes);"
router.get('/:userId', (req: Request, res: Response) => {
  const id = req.params["userId"];

  getUser(id, (user) => {
    if (!user) { return res.status(404).send('User not found') }

    return res.send(user);
  });

  /* try {
    const user = await User.findById(req.params.userId);
  
    if (!user) return res.status(404).send('The User with this id does not exists');
  
    res.send(user);    
  } catch(ex) {
    console.log(ex);
    
  } */
});

router.get('/', async (req: Request, res: Response) => {

  const users = await getUsers();

  res.send(users);
});

router.post('/', (req: Request, res: Response) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).send("Please provide a firstname, lastname and email");
  }

  // Appelle le controller
  const newUser = createUser(firstname, lastname, email);

  res.send(newUser);
});

router.patch('/:userId', async (req: Request, res: Response) => {

  const { firstname, lastname, email } = req.body;

  const user = await User.findById(req.params.userId);
  console.log(user);

  if (!user) return res.status(404).send('the user with this id does not exists');

  const patchedUser = await User.findByIdAndUpdate(req.params.userId, {
    $set: {
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      email: email || user.email
    }
  }, { new: true });

  console.log(patchedUser);

  res.send(patchedUser);

  /* avant utilisation de la bdd (données statiques) :
  // obligation de vérifier si user existe avec TS pour vérifier si firstname (req.body) est vrai sinon on prent la valeur de user.firstname... 
  if (user) { 
    const patchedUser = {
      ...user,
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      email: email || user.email
    };

  const index = users.indexOf(user);
  console.log(index);

  users[index] = patchedUser;
  console.log(users[index]); */

});

router.delete('/:userId', async (req: Request, res: Response) => {

  const user = await User.findByIdAndRemove(req.params.userId);

  if (!user) { return res.status(404).send('the user with this id does not exists')};

  res.send(user);

  /* const user: any = getUsers().find(user => user.id === parseInt(req.params.userId));

  const index = getUsers().indexOf(user);

  getUsers().splice(index, 1);

  res.send(getUsers()); */
});


export default router;