/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const fs = require('fs');
const { buildKeys } = require('../helpers');

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
    let bucketSchema = {};
    let marker = null;
    let result;
    do {
      result = await processNextPage(marker);

      if (result.IsTruncated) {
        marker = result.Contents[result.Contents.length - 1].Key;
      }

      bucketSchema = result.Contents.reduce((services, current) => {
        const url = current.Key;
        const { service, version } = buildKeys(url);

        if (!(service in services)) {
          services[service] = [];
        }

        services[service].push({
          key: url,
          version,
        });

        return services;
      }, bucketSchema);
    } while (result.IsTruncated);
    return bucketSchema;
  }

  async function downloadFile(key) {
    const filePath = `private/${key.replace(/\//g, '')}`;
    const parameters = {
      Bucket: params.Bucket,
      Key: key,
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
