const { request } = require('graphql-request');
const { GRAPHQL_SERVER_ENDPOINT } = require('../config');

const saveLogToUser = (userId, log) => {
  // graphQL mutation to add logs
  const query = `mutation ($input: CreateLogInput!) {
      createLog(input: $input){
          _id
        }
    }`;

  // variables: params needed for CreateLogInput! typeDef in pokke-graphql-server > typeDefs
  const { apiKey, subject, message, contact, status } = log;
  const variables = { input: { _id: userId, apiKey, subject, message, contact, status } };

  request(GRAPHQL_SERVER_ENDPOINT, query, variables)
    .then((response) => {
      console.log('​--------------------------------------');
      console.log('​saveLogToUSER -> response', response);
      console.log('​--------------------------------------');
    })
    .catch((err) => {
      console.log(err.response.errors); // GraphQL response errors
      console.log(err.response.data); // Response data if available
    });
};

module.exports = saveLogToUser;
