const { request } = require('graphql-request');
const { GRAPHQL_SERVER_ENDPOINT } = require('../config');

const saveLogToApiKey = (apiKeyId, log) => {
  // graphQL mutation to add logs
  const query = `mutation ($input: CreateApiKey_LogInput! ) {
      addLogToApiKey(input: $input) {
          _id
        }
    }`;

  // variables needed for CreateApiKey_LogInput! in pokke-graphql-server > typeDefs
  const { subject, message, contact, status } = log;
  const variables = { input: { _id: apiKeyId, subject, message, contact, status } };

  request(GRAPHQL_SERVER_ENDPOINT, query, variables)
    .then((response) => {
      console.log('​--------------------------------------');
      console.log('​saveLogToApiKey -> response', response);
      console.log('​--------------------------------------');
    })
    .catch((err) => {
      console.log(err.response.errors); // GraphQL response errors
      console.log(err.response.data); // Response data if available
    });
};

module.exports = saveLogToApiKey;
