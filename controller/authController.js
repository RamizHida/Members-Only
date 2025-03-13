const db = require('../db/queries');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { username, fullname, password } = req.body;
  try {
    if (!username || !fullname || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const { rows } = await db.getUserByName(username);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash before storing
    await db.signUp(username, fullname, hashedPassword);

    res.status(201).json('User registered successfully');
  } catch (error) {
    console.log('Database Error:', error);
    res.status(500).json({ error: error.message });
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
