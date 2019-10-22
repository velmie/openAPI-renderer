require('dotenv').config();
const AWS = require('aws-sdk');
const Cache = require('../lib/cache');
const SchemaRepository = require('../lib/schemas');

const {
    CACHE_TTL           = 1000 * 60,        // 60s
    CACHE_MAX_SIZE      = 50 * 1024 * 1024, // 50MB
    S3_BUCKET,
    S3_PREFIX,
    S3_API_VERSION      = '2006-03-01',
    S3_OBJECTS_PER_PAGE = 1000,
    S3_AWS_REGION,
    S3_AWS_ACCESS_KEY_ID,
    S3_AWS_SECRET_ACCESS_KEY,
} = process.env;

AWS.config.region = S3_AWS_REGION;
AWS.config.credentials = {
    accessKeyId: S3_AWS_ACCESS_KEY_ID,
    secretAccessKey: S3_AWS_SECRET_ACCESS_KEY,
};

const s3 = new AWS.S3({
    apiVersion: S3_API_VERSION,
});

const repo = SchemaRepository(s3, {
    Bucket: S3_BUCKET,
    Prefix: S3_PREFIX,
    MaxKeys: S3_OBJECTS_PER_PAGE,
});

const cache = Cache(CACHE_TTL, CACHE_MAX_SIZE);

module.exports = { repo, cache };
