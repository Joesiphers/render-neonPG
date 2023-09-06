async function dbquery(pool, query) {
  try {
    const client = await pool.connect();

    const result = await client.query(query);
    client.release();
    return result;
  } catch (error) {
    return error;
  }
}

module.exports.dbquery = dbquery;
