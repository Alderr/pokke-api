const isValidEmail = require('../helpers/isValidEmail');
const isValidPhoneNumber = require('../helpers/isValidPhoneNumber');


const sendPokke = (subject, message, contacts) => {
  console.log('​--------------------------------------------------------------------');
  console.log('​sendPokke -> subject, message, contacts', subject, message, contacts);
  console.log('​--------------------------------------------------------------------');


  contacts.forEach((contact) => {
    console.log(contact);

    // if validEmal
    if (isValidEmail(contact)) {
      console.log('​------------------------------');
      console.log('​email:', contact);
      console.log('​------------------------------');
    } else if (isValidPhoneNumber(contact)) {
      console.log('#: ', contact);
    } else {
      // invalid contact
      console.log('Invalid?!?!');
    }
  });
};


module.exports = sendPokke;
