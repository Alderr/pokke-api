

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { PORT } = require('./config');
const { dbConnect } = require('./db-mongoose');

const sendPokke = require('./controllers/pokke');
const isValidApiKey = require('./helpers/isValidApiKey');

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));

app.use(cors());
app.use(bodyParser.json());

// custom auth middleware
app.use((req, res, next) => {
  /*
  > all requests to server need an apiKey; stored in headers.Authorization
  */
  console.log('Auth middleware');

  if (req.headers.authorization) {
    const auth = req.headers.authorization.split(' ');

    if (auth[0] === 'Bearer') {
      // array destructing [ 0, 1, 2, ....]
      const [, apiKey] = auth;

      console.log('​---------------');
      console.log('​apiKey', apiKey);
      console.log('​---------------');

      // success: authenticated user comes back; failure: err is caught & sent
      return isValidApiKey(apiKey)
        .then((verdict) => {
          console.log('​-----------------');
          console.log('​verdict', verdict);
          console.log('​-----------------');

          // verdict is a valid apiKey + userID
          req.user = verdict;

          return next();
        })
        .catch(err => res.status(401).send(err.message));
    }

    return res.status(401).send('Bad authorization format.');
  }


  return res.status(401).send('No authorization/api key in request.');
});

app.post('/pokke', (req, res) => {
  /*
  > client sends items in body
  body - contacts, message, subject[email-title]
  > iterate over array of contacts & [sendEmail] or [sendTextMessage] is called

  */
  const { user } = req;
  const { subject, message, contacts } = req.body;

  console.log('​-------------------------------------------------------');
  console.log('​subject, message, contacts', subject, message, contacts);
  console.log('​-------------------------------------------------------');

  // checkers for input
  if (message !== '' || contacts.length !== 0) {
    sendPokke(user, subject, message, contacts);
    return res.send('Sending pokke.');
  }

  return res.send('Empty fields.');
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
