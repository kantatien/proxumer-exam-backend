require("dotenv").config();

module.exports = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '6379',
  username: process.env.MONGO_USERNAME || '',
  password: process.env.MONGO_PASSWORD || '',
  database: process.env.MONGO_DATABASE || 'ms-example',
};
