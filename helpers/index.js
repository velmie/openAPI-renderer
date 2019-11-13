const moment = require('moment');

const helpers = {};

helpers.buildKeys = (url) => {
  const [stage, app, stamp, file] = url.split('/');

  if (file !== 'openapi.yml' || !stage) {
    return 0;
  }

  let [timestamp, edition] = stamp.split('-');

  const date1 = moment.unix(timestamp).format('YYYY-MM-DD HH:mm');
  const date2 = moment.unix(edition).format('YYYY-MM-DD HH:mm');

  edition = date1 === 'Invalid date' ? timestamp : edition;
  timestamp = date1 !== 'Invalid date' ? date1 : date2;

  const service = `${app}:${stage}`;
  const version = `${edition || ''}${timestamp !== 'Invalid date' && edition ? ' - ' : ''}${timestamp !== 'Invalid date' ? timestamp : ''}`;

  return { service, version };
};

module.exports = helpers;
