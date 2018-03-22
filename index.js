

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { PORT } = require('./config');
const { dbConnect } = require('./db-mongoose');

const isValidApiKey = require('./services/isValidApiKey');

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

      return isValidApiKey(apiKey)
        .then((verdict) => {
          console.log('​-----------------');
          console.log('​verdict', verdict);
          console.log('​-----------------');

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
  res.send('Hit /POST pokke path');
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
