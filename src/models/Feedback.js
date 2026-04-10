const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Feedback = sequelize.define('Feedback', {
  text: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  category: { type: DataTypes.STRING },
  sentiment: { type: DataTypes.STRING },
});

Feedback.belongsTo(User, { foreignKey: 'userId' });

module.exports = Feedback;
