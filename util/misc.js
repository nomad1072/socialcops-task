const bunyan = require('bunyan');
const raven = require('raven');
const { SentryStream } = require('bunyan-sentry-stream');
const { sentryDsn } = require('../config');

const sentryClient = new raven.Client(sentryDsn);

exports.logger = bunyan.createLogger({
  name: 'socialcops-assignment',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      type: 'raw',
      stream: new SentryStream(sentryClient)
    }
  ]
});
