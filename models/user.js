const db = require('../utils/db');

module.exports = {
  all: _ => db.load('select * from users_clc'),
  add: entity => db.add(entity, 'users_clc'),

  singleByUserName: async username => {
    const rows = await db.load(`select * from users_clc where username = '${username}'`);
    if (rows.length > 0)
      return rows[0];

    return null;
  }
};
