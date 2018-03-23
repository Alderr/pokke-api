const mongoose = require('mongoose');
const { Schema } = require('mongoose');

mongoose.Promise = global.Promise;

const ApiKeySchema = new Schema({
  key: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  usage: { type: Number, default: 0 },
  logs: [
    {
      date: { type: Number, default: Date.now() },
      subject: { type: String, default: '' },
      message: { type: String, default: '' },
      contact: { type: String, default: '' },
      status: { type: String, default: '' },
      valid: { type: Boolean, default: true },
    },
  ],
});

const ApiKeyModel = mongoose.model('ApiKeys', ApiKeySchema);

module.exports = ApiKeyModel;
