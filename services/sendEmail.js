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

  let emailParams = {
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

  return resolve(emailParams);
};


module.exports = sendEmail;
