const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
  try {
    const { username, password , role} = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: role || 'user' });
    res.json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
