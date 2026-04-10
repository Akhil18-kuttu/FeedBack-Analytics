const express = require('express');
const router = express.Router();
const { sentimentDistribution, feedbackTrends } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/sentiment', authMiddleware, sentimentDistribution, requireAdmin);
router.get('/trends', authMiddleware, feedbackTrends, requireAdmin);

module.exports = router;
