const { query } = require('../database/db');

const RolModel = {
  async findAll() {
    const { rows } = await query('SELECT * FROM roles ORDER BY id');
    return rows;
  },
  async findById(id) {
    const { rows } = await query('SELECT * FROM roles WHERE id = $1', [id]);
    return rows[0];
  },
};

module.exports = RolModel;
