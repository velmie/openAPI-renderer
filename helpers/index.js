const moment = require('moment');

const helpers = {};

helpers.buildKeys = function(url) {
  const [stage, app, stamp] = url.split('/');
  const [timestamp, version] = stamp.split('-');
  const date = moment.unix(timestamp).format("YYYY-MM-DD HH:mm");

  const serviceKey = `${app}:${stage}`;
  const sortKey = `${date} - ${version}`;

  return { serviceKey, sortKey };
}

module.exports = helpers;