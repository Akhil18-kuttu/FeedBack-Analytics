const Feedback = require('../models/Feedback');
const User = require('../models/User');

module.exports = {
  getAllFeedback: async (req, res) => {
    const feedbacks = await Feedback.findAll({ include: User });
    res.json(feedbacks);
  },
  getUserList: async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  },
  getDashboard: async (req, res) => {
    const feedbackCount = await Feedback.count();
    const userCount = await User.count();
    res.json({ feedbackCount, userCount });
  }
};
