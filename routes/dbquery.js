const { Client, Pool } = require("pg");
const pool = new Pool({
  user: "joed",
  host: "dpg-cjrufkdm702s738asrgg-a.oregon-postgres.render.com",
  password: "Ov6GH4LYKiNCkYzDL1bsd6yxZsnRMnwf",
  port: "5432",
  database: "reactpg",
  ssl: true,
});

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

async function insertRecord(req, res) {
  const client = await pool.connect();

  const data = req.query;
  const keys = Object.keys(data);
  const values = Object.values(data);
  console.log("received data", keys, values);

  try {
    // Connect to the database
    //  const client = await pool.connect();
    // SQL query for inserting a record
    const insertQuery = `
      INSERT INTO title ( ${keys[1]},username)
      VALUES ($1,$2) 
      RETURNING *;`;
    //$1 as parametered way.point to the array index
    // Values to be inserted
    // Execute the query
    const result = await client.query(insertQuery, values);

    // Print the inserted record
    console.log("Inserted record:", result.rows[0]);
    res.status(500).json({ result: result });
    client.release();
  } catch (error) {
    console.error("Error inserting record:", error);
    res.status(500).json({ error: error });
  } finally {
    // Close the database connection
    await client.end();
  }
}
module.exports.insertQuery = insertRecord;
