// const { google } = require("googleapis");
// require("dotenv").config();

import { google } from "googleapis";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

const youtube = google.youtube({
  version: "v3",
  auth: process.env.AUTH,
});

async function create({ singleStoreConnection, comment }) {
  try {
    console.log(comment); // Add this line to log the comment object
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
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getYoutubeComments() {
  return new Promise((resolve, reject) => {
    youtube.commentThreads.list(
      {
        part: "snippet",
        videoId: "JTxsNm9IdYU",
        maxResults: 100,
      },
      (err, data) => {
        if (err) throw err;
        // console.log(data);
        const comments = data.data.items;
        resolve(comments);

        // comments.forEach((comment) => {
        //   const text = comment.snippet.topLevelComment.snippet.textDisplay;
        //   console.log(text);
        // });

        // let json = JSON.stringify(comments);
        // fs.writeFile("comments.json", json, "utf8", (err) => {
        //   if (err) throw err;
        //   console.log("The file has been saved");
        // })
      }
    );
  });
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

    let comments = await getYoutubeComments();

    for (let i = 0; i < comments.length; i++) {
      // call the create() function inside the main() function as:
      const id = await create({
        singleStoreConnection,
        comment: {
          commentid: comments[i].id,
          commenter:
            comments[i].snippet.topLevelComment.snippet.authorDisplayName,
          comment: comments[i].snippet.topLevelComment.snippet.textOriginal,
          gpt: "",
          flag: 0,
          respond: 0,
        },
      });
      console.log(`Inserted row id is: ${id}`);
    }
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
