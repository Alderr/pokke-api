const isValidEmail = require('../helpers/isValidEmail');
const isValidPhoneNumber = require('../helpers/isValidPhoneNumber');
const createDelayedPromise = require('../helpers/createDelayedPromise');
const sendEmail = require('../services/sendEmail');
const sendText = require('../services/sendText');

const { EMAIL_SENDER, SMS_SENDER } = require('../config');

const sendPokke = (subject, message, contacts) => {
  console.log('​--------------------------------------------------------------------');
  console.log('​sendPokke -> subject, message, contacts', subject, message, contacts);
  console.log('​--------------------------------------------------------------------');

  const arrOfSendEmailCommands = [];
  const arrOfSendTextCommands = [];
  const arrOfLogs = [];

  contacts.forEach((contact) => {
    console.log('​------------------------------');
    console.log('​checking contact...', contact);
    console.log('​------------------------------');


    // if validEmal
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

    else {
      // invalid contact
      console.log('Invalid?!?!');
      // refer to apiKeyModel - logs.
      arrOfLogs.push({
        date: Date.now(),
        subject,
        message,
        contacts: {
          email: contact,
          phoneNumber: contact,
        },
      });
    }
  });

  console.log('Running commands...');

  // running all commands to send Email
  Promise.all(arrOfSendEmailCommands.map(command => command()))
    .then((responses) => {
      console.log('​----------------------------------');
      console.log('Promise.all EMAIL -> responses', responses);
      console.log('​----------------------------------');
      //
      return responses;
    })
    .catch((err) => {
      console.log('​----------------------');
      console.log('​Promise.all EMAIL -> err', err);
      console.log('​----------------------');

      return err;
    });

  // running all commands to send SMS
  Promise.all(arrOfSendTextCommands.map(command => command()))
    .then((responses) => {
      console.log('​----------------------------------');
      console.log('Promise.all SMS -> responses', responses);
      console.log('​----------------------------------');

      return responses;
    })
    .catch((err) => {
      console.log('​----------------------');
      console.log('​Promise.all SMS -> err', err);
      console.log('​----------------------');

      return err;
    });
};


module.exports = sendPokke;
