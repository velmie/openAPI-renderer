const moment = require('moment');

const helpers = {};

helpers.buildKeys = (url) => {
  const [stage, app, stamp] = url.split('/');
  const [timestamp, edition] = stamp.split('-');
  const date = moment.unix(timestamp).format('YYYY-MM-DD HH:mm');

  const service = `${app}:${stage}`;
  const version = `${date !== 'Invalid date' ? date : ''}${date && edition ? '-' : ''}${date === 'Invalid date' && !edition ? timestamp : (edition || '')}`;

  return { service, version };
};

module.exports = helpers;
