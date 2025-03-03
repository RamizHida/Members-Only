const pool = require('./pool');
const bcryptjs = require('bcryptjs');

async function signUp(userName, fullName, password) {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    await pool.query(
      'INSERT INTO users(username, password, fullname) VALUES ($1, $2, $3)',
      [userName, hashedPassword, fullName]
    );
  } catch (error) {
    console.log('There was a sign-up error');
  }
}

async function logIn(username, password) {
  try {
    // user passport
  } catch (error) {
    console.log('There was an error loggin in: ', error);
  }
}

module.exports = {
  signUp,
  logIn,
};
