const express = require("express");

const app = express();
const port = 5002;
const { Client, Pool } = require("pg");
const { dbquery } = require("./routes/dbquery");

const postgres = require("postgres");
//require("dotenv").config();
const dbconfig = {
  host: "ep-frosty-haze-09169370.ap-southeast-1.aws.neon.tech",
  database: "neondb",
  username: "Joesiphers",
  password: "j7ZgVUoK4tPn",
  port: 5432,
  ssl: "require",
  connection: { options: `project=ep-frosty-haze-09169370` },
};
const sql = postgres(dbconfig);
//const pool = new Pool(dbconfig);
const DATABASE_URL =
  "ppostgres://Joesiphers:j7ZgVUoK4tPn@ep-frosty-haze-09169370.ap-southeast-1.aws.neon.tech/neondb?options=endpoint%3Dep-frosty-haze-09169370";
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    require: true,
  },
});
async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}
//getPgVersion();
/*const pool = new Pool({
  user: "joed",
  host: "dpg-cjrufkdm702s738asrgg-a.oregon-postgres.render.com",
  password: "Ov6GH4LYKiNCkYzDL1bsd6yxZsnRMnwf",
  port: "5432",
  database: "reactpg",
  ssl: true,
});
*/
//const client = pool.connect();
//create table. ct
app.get("/ct", async (req, res) => {
  try {
    //const client = await pool.connect();
    const client = await pool.connect();
    const query = `
      CREATE TABLE IF NOT EXISTS title (
        id SERIAL PRIMARY KEY,
        title varchar
       )
    `;
    await client.query(query);
    // await sql(query);
    client.release();
    res.json({ message: "Table created successfully!" });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: error });
  }
});

// Call the insertRecord function to insert a record
app.get("/it", async (req, res) => {
  const client = await pool.connect();
  try {
    // Connect to the database
    //  const client = await pool.connect();
    // SQL query for inserting a record
    const insertQuery = `
      INSERT INTO title (title,username)
      VALUES ($1,$2) 
      RETURNING *;`;
    //$1 as parametered way.point to the array index
    // Values to be inserted
    const values = ["mq", "mm"]; // Replace with your actual value

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
const { insertQuery } = require("./routes/dbquery");
app.get("/insert", async (req, res) => {
  try {
    // Print the inserted record
    console.log("Inserted record:", req.body, "param", req.param, req.query);
    insertQuery(req, res);
  } catch (error) {
    console.error("Error inserting record:", error);
    res.status(500).json({ error: error });
  } finally {
    // Close the database connection
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
