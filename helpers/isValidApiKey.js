const ApiKeyModel = require('../models/ApiKeyModel');

const isValidApiKey = (apiKey) => {
  let foundApiKey;
  return ApiKeyModel.findOne({ key: apiKey })
    .then((response) => {
      foundApiKey = response;

      if (foundApiKey) {
        console.log('​------------------------------------------');
        console.log('​isValidApiKey -> foundApiKey', foundApiKey);
        console.log('​------------------------------------------');
        return foundApiKey;
      }


      throw new Error('Invalid authorization.');
    });
};


module.exports = isValidApiKey;
