const ApiKeyModel = require('../models/ApiKeyModel');

const isValidApiKey = (apiKey) => {
    let foundApiKey;
    return ApiKeyModel.find({ key: apiKey })
      .then((response) => {
        foundApiKey = response;

        if (foundApiKey) {
            console.log('​------------------------------------------');
            console.log('​isValidApiKey -> foundApiKey', foundApiKey);
            console.log('​------------------------------------------');
            return foundApiKey;
        }

        else {
            throw new Error('Invalid authorization.');
        }
      })
};


module.exports = isValidApiKey;