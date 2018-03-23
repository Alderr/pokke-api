const { request } = require('graphql-request');
const { GRAPHQL_SERVER_ENDPOINT } = require('../config');

const incrementUsage = (apiKeyId) => {
  // graphQL mutation to add logs
  const query = `mutation {
      incrementUsage(_id: "${apiKeyId}"){
          _id
          usage
        }
    }`;

  request(GRAPHQL_SERVER_ENDPOINT, query)
    .then((response) => {
      console.log('​--------------------------------------');
      console.log('​incrementUsage of API KEY -> response', response);
      console.log('​--------------------------------------');
    })
    .catch((err) => {
      console.log(err.response.errors); // GraphQL response errors
      console.log(err.response.data); // Response data if available
    });
};

module.exports = incrementUsage;
