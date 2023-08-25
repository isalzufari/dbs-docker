const { Pool } = require('pg');
const CacheService = require('../redis/CacheService');

class SongsService {
  constructor() {
    this._pool = new Pool({
      user: 'postgres',
      database: 'songsapp',
      password: '1234',
      host: 'localhost',
      port: 5433,
    });

    this._cacheService = new CacheService();
  }

  async getCompany() {
    try {
      const result = await this._cacheService.get(`company`);
      console.log('cache');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query('SELECT * FROM company');
      console.log('database');
      await this._cacheService.set(`company`, JSON.stringify(result.rows));
      return result.rows;
    }
  }
}

module.exports = SongsService;
