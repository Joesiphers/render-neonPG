const express = require("express");

const app = express();
const port = 5002;
const { Client, Pool } = require("pg");
const { dbquery } = require("./routes/dbquery");

/*const client = new Client({
  user: "joed",
  host: "dpg-cjrufkdm702s738asrgg-a.oregon-postgres.render.com",
  password: "Ov6GH4LYKiNCkYzDL1bsd6yxZsnRMnwf",
  port: "5432",
  database: "reactpg",
  ssl: true,
});*/
const pool = new Pool({
  user: "joed",
  host: "dpg-cjrufkdm702s738asrgg-a.oregon-postgres.render.com",
  password: "Ov6GH4LYKiNCkYzDL1bsd6yxZsnRMnwf",
  port: "5432",
  database: "reactpg",
  ssl: true,
});
//const client = pool.connect();
app.get("/ct", async (req, res) => {
  try {
    console.log(req);
    const client = await pool.connect();
    const query = `
      CREATE TABLE IF NOT EXISTS title (
        id SERIAL PRIMARY KEY,
        title varchar
       )
    `;
    await client.query(query);
    client.release();
    res.json({ message: "Table created successfully!" });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: error });
  }
});

// Call the insertRecord function to insert the record
app.get("/it", async (req, res) => {
  const client = await pool.connect();
  try {
    // Connect to the database
    //  const client = await pool.connect();

    // SQL query for inserting a record
    const insertQuery = `
      INSERT INTO title (title)
      VALUES ($1)
      RETURNING *;`;

    // Values to be inserted
    const values = ["mr"]; // Replace with your actual value

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
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

//app.use("/users", usersRouter);
async function dbq(pool, query) {
  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return result;
  } catch (error) {
    return error;
  }
}
app.get("/ic", async (req, res) => {
  const query = `
  ALTER TABLE title
  ADD COLUMN username varchar(12) ;
`;
  const result = await dbq(pool, query);
  res.status(200).json({ result: result });
});

app.get("/all", async (req, res) => {
  const query = `
  TABLE title
`;
  const result = await dbquery(pool, query);
  res.status(200).json({ result: result });
});

app.get("/selectall", async (req, res) => {
  const query = `
  SELECT * FROM title
`;
  const result = await dbquery(pool, query);
  res.status(200).json({ result: result });
});

app.get("/idtitle", async (req, res) => {
  const query = `
  SELECT id,title FROM title
`;

  const result = await dbquery(pool, query);
  res.status(200).json({ result: result.rows });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
