const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const db = require('./db/queries');
const pool = require('./db/pool');
const pgSession = require('connect-pg-simple')(session);
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Import routers
const authRouter = require('./routes/authRouter');
const messageRouter = require('./routes/messageRouter');

// Middleware to parse URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session middleware
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }, // 1 hour session
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/', authRouter);
app.use('/messages', messageRouter);

// Passport Local Strategy for authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await db.getUserByName(username);
      const user = rows[0];

      console.log(user, 'user OBJ');

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      if (!user.password) {
        return done(null, false, {
          message: 'Password is missing for this user',
        });
      }
      const hashedPassword = user.password.toString('utf-8'); // Convert buffer to string

      const isMatch = await bcryptjs.compare(password, hashedPassword);

      if (!isMatch) return done(null, false, { message: 'Invalid Password ' });

      console.log('User authenticated successfully');
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

//  Serialie and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.getUserById(id);
    const user = rows[0];

    if (!user) {
      return done(false, null);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App lisenting on port ', port);
});
