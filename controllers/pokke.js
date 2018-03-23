const isValidEmail = require('../helpers/isValidEmail');
const isValidPhoneNumber = require('../helpers/isValidPhoneNumber');
const createDelayedPromise = require('../helpers/createDelayedPromise');
const sendEmail = require('../services/sendEmail');

const { SENDER } = require('../config');

const sendPokke = (subject, message, contacts) => {
  console.log('​--------------------------------------------------------------------');
  console.log('​sendPokke -> subject, message, contacts', subject, message, contacts);
  console.log('​--------------------------------------------------------------------');

  const arrOfSendEmailCommands = [];
  const arrOfSendTextCommands = [];

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
        sender: SENDER,
        subject: 'App Warning!',
        message: 'yo, watch out. your app broke',
        contact: [contact],
      };

      arrOfSendEmailCommands.push(createDelayedPromise(sendEmail, sendEmailParams));
    } else if (isValidPhoneNumber(contact)) {
      console.log('​------------------------------');
      console.log('#: ', contact);
      console.log('​------------------------------');

      /*
      > create sendEmailCommand promise w/ req. info
      > store it in sendEmailCommands
      */
    } else {
      // invalid contact
      console.log('Invalid?!?!');
    }
  });

  console.log('Running commands...');

  Promise.all(arrOfSendEmailCommands.map(command => command()))
    .then((responses) => {
      console.log('​----------------------------------');
      console.log('Promise.all -> responses', responses);
      console.log('​----------------------------------');
    });
};


module.exports = sendPokke;
