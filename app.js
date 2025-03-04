const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
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
    store: new pgSession({ pool }),
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
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) return done(null, false, { message: 'Invalid Password ' });

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
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);

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
