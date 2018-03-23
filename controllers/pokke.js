const isValidEmail = require('../helpers/isValidEmail');
const isValidPhoneNumber = require('../helpers/isValidPhoneNumber');

const createDelayedPromise = require('../services/createDelayedPromise');
const sendEmail = require('../services/sendEmail');
const sendText = require('../services/sendText');

const incrementUsageOfApiKey = require('./incrementApiKeyUsage');
const saveLogToApiKey = require('./saveLogToApiKey');
const saveLogToUser = require('./saveLogToUser');


const { EMAIL_SENDER, SMS_SENDER } = require('../config');

const sendPokke = (userObj, subject, message, contacts) => {
  console.log('​--------------------------------------------------------------------');
  console.log('​sendPokke -> user, subject, message, contacts', userObj, subject, message, contacts);
  console.log('​--------------------------------------------------------------------');

  const { _id, key, user } = userObj;

  const apiKey = key;
  const apiKeyId = _id;
  const userId = user;

  const arrOfSendEmailCommands = [];
  const arrOfSendTextCommands = [];
  const arrOfLogs = [];

  contacts.forEach((contact) => {
    console.log('​------------------------------');
    console.log('​checking contact...', contact);
    console.log('​------------------------------');

    // everytime i loop; regardless of successful/failed sent pokke; usage increases.
    incrementUsageOfApiKey(apiKeyId);

    // check if validEmail
    if (isValidEmail(contact)) {
      console.log('​------------------------------');
      console.log('​email:', contact);
      console.log('​------------------------------');

      /*
      > create sendEmailCommand promise w/ req. info
      > store it in sendEmailCommands
      */
      const sendEmailParams = {
        sender: EMAIL_SENDER,
        subject,
        message,
        contact: [contact],
      };

      arrOfSendEmailCommands.push(createDelayedPromise(sendEmail, sendEmailParams));
    }
    // check if valid phone number!
    else if (isValidPhoneNumber(contact)) {
      console.log('​------------------------------');
      console.log('#: ', contact);
      console.log('​------------------------------');

      /*
      > create sendEmailCommand promise w/ req. info
      > store it in sendEmailCommands
      */

      const sendTextParams = {
        sender: SMS_SENDER,
        message,
        contact,
      };

      arrOfSendTextCommands.push(createDelayedPromise(sendText, sendTextParams));
    }
    // invalid contact
    else {
      console.log('Invalid?!?!');

      // refer to apiKeyModel - logs.
      // saving this log immediately when user sends invalid contact
      const invalidLog = {
        date: Date.now(),
        apiKey,
        subject,
        message,
        contact,
        status: 'FAILURE',
      };

      saveLogToApiKey(apiKeyId, invalidLog);
      saveLogToUser(userId, invalidLog);
    }
  });

  console.log('Running commands...');

  // running all commands to send Email
  Promise.all(arrOfSendEmailCommands.map(command => command()))
    .then((responses) => {
      console.log('​----------------------------------');
      console.log('Promise.all EMAIL -> responses', responses);
      console.log('​----------------------------------');

      // look thro responses and see if its a SUCCESS/FAILURE
      responses.forEach((response) => {
        console.log('​--------------------------------');
        console.log('​SENDING LOGS EMAIL -> response', response);
        console.log('​--------------------------------');

        const log = {
          date: Date.now(),
          apiKey,
          subject: response.data.subject,
          message: response.data.message,
          contact: response.data.contact[0], // sendEmail was given one email
          status: '',
        };

        if (response.status === 'resolved') {
          log.status = 'SUCCESS';
        }

        else {
          log.status = 'FAILURE';
        }

        saveLogToApiKey(apiKeyId, log);
        saveLogToUser(userId, log);
      });
    })
    .catch((err) => {
      console.log('​----------------------');
      console.log('​Promise.all EMAIL -> err', err);
      console.log('​----------------------');

      return err;
    });

  // running all commands to send SMS
  // Promise.all(arrOfSendTextCommands.map(command => command()))
  //   .then((responses) => {
  //     console.log('​----------------------------------');
  //     console.log('Promise.all SMS -> responses', responses);
  //     console.log('​----------------------------------');

  //     // look thro responses and see if its a SUCCESS/FAILURE
  //     responses.forEach((response) => {
  //       console.log('​--------------------------------');
  //       console.log('​sendPokke -> response', response);
  //       console.log('​--------------------------------');

  //       const log = {
  //         date: Date.now(),
  //         apiKey,
  //         subject: response.data.subject,
  //         message: response.data.message,
  //         contact: response.data.contact,
  //         status: '',
  //       };

  //       if (response.status === 'resolved') {
  //         log.status = 'SUCCESS';
  //       }

  //       else {
  //         log.status = 'FAILURE';
  //       }

  //       saveLogToApiKey(apiKeyId, log);
  //       saveLogToUser(userId, log);
  //     });
  //   })
  //   .catch((err) => {
  //     console.log('​----------------------');
  //     console.log('​Promise.all SMS -> err', err);
  //     console.log('​----------------------');

  //     return err;
  //   });
};


module.exports = sendPokke;
