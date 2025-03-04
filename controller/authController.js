const bcryptjs = require('bcryptjs');
const pool = require('../db/pool');

exports.signup = async (req, res) => {
  const { username, fullname, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    await pool.query(
      'INSERT INTO users(username, fullname, password) VALUES ($1, $2, $3)',
      [username, fullname, hashedPassword]
    );

    res.status(201).json('User registered successfully');
  } catch (error) {
    res.status(500).json({ error: 'User already exists or database error' });
  }
};
exports.login = (req, res) => {
  res.json({ message: 'Logged In Succesffuly', user: req.user });
};

exports.logout = (req, res) => {
  req.logout((error) => {
    if (error) res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
};
