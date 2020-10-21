import { DatabaseError } from './../controllers/errors/databaseErrors';
import { IUser } from './../models/usersModel';
import { Router } from 'express';
import { authenticationRequired } from '../middlewares/authenticationRequired';
import { Message } from '../models/messagesModel';

const router = Router();

router.get('/', authenticationRequired, async (req, res) => {
    const connectedUser = req.user as IUser; // récupère le user connecté

    try { // on cherche à récupérer les messages soit via emitter soit via les targets
        const messages = await Message.find({
          $or: [
            { emitter: connectedUser._id },
            { targets: connectedUser._id }
          ]
        });
    
        return res.send(messages);

      } catch (err){
        throw new DatabaseError(err);
      }
});

router.post('/', authenticationRequired, async (req, res) => {
    const connectedUser = req.user as IUser
  
    const { content, conversationId, targets } = req.body
    if(!content || !conversationId || !targets || targets.length === 0){
      return res
        .status(400)
        .send(`Please ensure that your request contains : content, conversationId and targets.
         Also check that targets is not an empty array`);
    }
  
    const message = new Message({
      emitter: connectedUser._id,
      content: content,
      conversationId : conversationId,
      targets: targets,
      createdAt: new Date()
    })
  
    try {
      const createdMessage = await message.save()
      return res.send(createdMessage);
    } catch(err) {
      throw new DatabaseError(err);
    }
  });

export default router;
