const Twilio = require('twilio');

const { AUTHTOKEN, ACCOUNTSID } = require('../config');

const client = new Twilio(ACCOUNTSID, AUTHTOKEN);


const sendText = (resolve, reject, funcParams) => {
  const { message, contact, sender } = funcParams;
  console.log('​-----------------------------------------------------------------');
  console.log('​sendText ->  message, contact, sender', message, contact, sender);
  console.log('​-----------------------------------------------------------------');

  // send text w/ funcParams as info
  return client.messages.create({
    body: message,
    to: contact,
    from: sender,
  })
    .then((response) => {
      console.log('​-------------------------------');
      console.log('​sendText -> response', response);
      console.log('​-------------------------------');

      return resolve(response);
    })
    .catch(err => reject(err));
};

module.exports = sendText;
