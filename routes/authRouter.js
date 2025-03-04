const { Router } = require('express');
const authController = require('../controller/authController');
const passport = require('passport');
const authRouter = Router();

authRouter.get('/', (req, res) => {
  return res.send('hellooo');
});
authRouter.post('/signup', authController.signup);
authRouter.post('/login', passport.authenticate('local'), authController.login);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;
