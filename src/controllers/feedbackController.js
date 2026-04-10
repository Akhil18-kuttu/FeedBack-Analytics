const Feedback = require('../models/Feedback');
const analyzeSentiment = require('../utils/sentiment');

exports.submitFeedback = async (req, res) => {
  try {
    const { text, rating, category } = req.body;
    const sentiment = analyzeSentiment(text);
    const feedback = await Feedback.create({
      text,
      rating,
      category,
      sentiment,
      userId: req.userId,
    });
    res.json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
