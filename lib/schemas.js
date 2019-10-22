const moment = require('moment');
const fs = require('fs');

module.exports = (s3, params) => {

  function processNextPage(Marker = null) {
    return new Promise((resolve, reject) => {
      s3.listObjects({ ...params, Marker }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async function loadSchemas() {
    let services = {};
    let marker = null;
    let result;
    do {
      result = await processNextPage(marker);

      if (result.IsTruncated) {
        marker = result.Contents[result.Contents.length-1].Key;
      }

      services = result.Contents.reduce((services, current) => {

        const url = current.Key;
        const [stage, app, stamp] = url.substr(params.Prefix.length).split('/');
        const [timestamp, version] = stamp.split('-');
        const date = moment.unix(timestamp).format("YYYY-MM-DD HH:mm");

        const serviceKey = `${app}:${stage}`;
        const sortKey = `${date} - ${version}`;

        if (!(serviceKey in services)) {
          services[serviceKey] = [];
        }

        services[serviceKey].push({
          key: url.substr(params.Prefix.length),
          sortKey,
        });

        return services;
      }, services);
    } while (result.IsTruncated);

    return services;
  }

  async function downloadFile(key) {
    const filePath = `private/${key.replace(/\//g, '')}`;
    const parameters = {
      Bucket: params.Bucket,
      Key: params.Prefix + key,
    };

    const response = await s3.getObject(parameters).promise();

    fs.writeFileSync(filePath, response.Body.toString());

    return filePath;
  }

  return {
    get: loadSchemas,
    getFilePath: downloadFile,
  };
};
