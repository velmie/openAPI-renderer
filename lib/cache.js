const LRU = require('lru-cache');

module.exports = (ttl, memoryLimit) => new LRU({
  max: parseInt(memoryLimit, 10),
  maxAge: parseInt(ttl, 10),
  length: (n, key) => (JSON.stringify(n).length + key.length),
});
