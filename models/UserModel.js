const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  logs: [
    {
      date: { type: Number, default: Date.now() },
      message: { type: String },
      apiKey: { type: String },
      contacts: [
        {
          email: { type: String },
          phoneNumber: { type: String },
        },
      ],
    },
  ],
  apiKeys: [{ type: Schema.Types.ObjectId, ref: 'ApiKeys' }],
});

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.generateToken = function () {
  const user = this;

  return jwt.sign({ user }, JWT_SECRET, {
    subject: this.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256',
  });
};


UserSchema.methods.serialize = function () {
  return {
    _id: this._id,
    username: this.username,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
    log: this.log,
    apiKeys: this.apiKeys,
  };
};

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;
