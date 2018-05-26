const express = require('express');
const bodyParser = require('body-parser');
const raven = require('raven');
const { router } = require('./routers/index');
const { sentryDsn } = require('./config');
const { logger } = require('./util/misc');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'images')));

raven.config(sentryDsn).install();

app.use(raven.requestHandler());
app.use(raven.errorHandler());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/v1', router);

const port = process.env.port || 8080;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
