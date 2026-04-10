const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/admin', adminRoutes);


if (require.main === module) {
  // Only start server if run directly (npm run dev)
  sequelize.sync({ force: true }).then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  });
}

module.exports = app;