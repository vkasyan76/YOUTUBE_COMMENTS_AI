import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

//Modify the connection details to match the details specified while
//deploying the SingleStore workspace:
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

async function create({ singleStoreConnection, comment }) {
  const [results] = await singleStoreConnection.execute(
    "INSERT INTO comments (commentid, commenter, comment, gpt, flag, respond) VALUES (?, ?, ?, ?, ?, ?)",
    [
      comment.commentid,
      comment.commenter,
      comment.comment,
      comment.gpt,
      comment.flag,
      comment.respond,
    ]
  );
  return results.insertId;
}

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

    // call the create() function inside the main() function as:
    const id = await create({
      singleStoreConnection,
      comment: {
        commentid: 1,
        commenter: "Adrian Twarog",
        comment: "Why did the database go on a diet? It had too many tables!",
        gpt: "",
        flag: 0,
        respond: 0,
      },
    });
    console.log(`Inserted row id is: ${id}`);
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
