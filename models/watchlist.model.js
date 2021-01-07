const db = require('../utils/db');

module.exports = {
  async add(detail) {
    const [result, fields] = await db.add(detail, 'watchList');
    return result;
  }
};
