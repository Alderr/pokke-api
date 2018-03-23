const aws = require('aws-sdk');

const { SECRETACCESSKEY, ACCESSKEYID } = require('../config');

const options = {
  secretAccessKey: SECRETACCESSKEY,
  accessKeyId: ACCESSKEYID,
  region: 'us-east-1',
};

const ses = new aws.SES(options);

const sendEmail = (resolve, reject, funcParams) => {
  const { subject, message, contact, sender } = funcParams;

  const emailParams = {
    Destination: {
      ToAddresses: contact,
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: sender,
    ConfigurationSetName: 'mailbox_events',
  };

  console.log('​----------------------------');
  console.log('​in sendEmail -> params', funcParams);
  console.log('​----------------------------');

  return ses.sendEmail(emailParams, (error, response) => {
    if (error) {
      console.log('error!');
      console.log(error);
      return reject({ error, subject, message, contact, sender });
    }
    console.log('success?');
    console.log(response);
    return resolve({ response, subject, message, contact, sender });
  });
};


module.exports = sendEmail;
