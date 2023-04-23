import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//Modify the connection details to match the details specified while
//deploying the SingleStore workspace:
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

// main is run at the end
async function main() {
  let singleStoreConnection;
  try {
    singleStoreConnection = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log("You have successfully connected to SingleStore.");
  } catch (err) {
    console.error("ERROR", err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
}

main();
