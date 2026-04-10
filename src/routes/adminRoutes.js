const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

router.get('/feedbacks', authMiddleware, requireAdmin, adminController.getAllFeedback);
router.get('/users', authMiddleware, requireAdmin, adminController.getUserList);
router.get('/dashboard', authMiddleware, requireAdmin, adminController.getDashboard);

module.exports = router;
