const pool = require('./pool');
const bcryptjs = require('bcryptjs');

async function signUp(userName, fullName, hashedPassword) {
  try {
    await pool.query(
      'INSERT INTO users (username, fullname,password) VALUES ($1, $2, $3)',
      [userName, fullName, hashedPassword]
    );
  } catch (error) {
    console.log('There was a sign-up error', error.message);
    throw error;
  }
}

async function getUserById(id) {
  return await pool.query('SELECT * FROM users WHERE id = $1', [id]);
}

async function getUserByName(username) {
  return await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
}

module.exports = {
  signUp,
  getUserById,
  getUserByName,
};
