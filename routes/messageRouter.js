const { Router } = require('express');
const authController = require('../controller/messageController');
const messageRouter = Router();

messageRouter.get('/', (req, res) => {
  return res.send('hellomessage');
});

module.exports = messageRouter;
