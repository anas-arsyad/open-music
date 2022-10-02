const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });
    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    try {
      const result = await this._client.set(key, value, 'EX', expirationInSecond);
      return result;
    } catch (error) {
      console.log('REDIS', error);
      return null;
    }
  }

  async get(key) {
    try {
      const result = await this._client.get(key);
      return { isError: false, data: result };
    } catch (error) {
      console.log('REDIS', error);
      return { isError: true, data: null };
    }
  }

  async delete(key) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.log('REDIS', error);
    }
  }
}

module.exports = CacheService;
