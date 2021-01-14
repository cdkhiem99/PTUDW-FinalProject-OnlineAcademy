const db = require('../utils/db');

module.exports = {
  async add(detail) {
    const [result, fields] = await db.add(detail, 'watchList');
    return result;
  },

  async deleteInWatchList(id) {
    const condition = {
      courseId: id,
    };

    const [result, fields] = await db.del(condition, 'watchList');
    return result;
  }
};
