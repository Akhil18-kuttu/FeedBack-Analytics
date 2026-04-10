const Feedback = require('../models/Feedback');
const { Op } = require('sequelize');

exports.sentimentDistribution = async (req, res) => {
  try {
    const counts = await Feedback.findAll({
      attributes: ['sentiment', [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('sentiment')), 'count']],
      group: ['sentiment'],
    });
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.feedbackTrends = async (req, res) => {
  try {
    const trends = await Feedback.findAll({
      attributes: [
        [Feedback.sequelize.fn('DATE', Feedback.sequelize.col('createdAt')), 'date'],
        [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('id')), 'count'],
      ],
      group: ['date'],
      order: [['date', 'ASC']],
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
