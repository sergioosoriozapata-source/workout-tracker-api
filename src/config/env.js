require('dotenv').config();

const env = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || 'workout-demo-key-123',
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = env;
