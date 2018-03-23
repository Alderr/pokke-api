require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/thinkful-backend-test',
  // AWS SES config
  SECRETACCESSKEY: process.env.SECRETACCESSKEY,
  ACCESSKEYID: process.env.ACCESSKEYID,
  SENDER: process.env.SENDER,
  // Twilio config
  AUTHTOKEN: process.env.AUTHTOKEN,
  ACCOUNTSID: process.env.ACCOUNTSID,
};
