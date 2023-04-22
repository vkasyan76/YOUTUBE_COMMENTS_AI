// const { google } = require("googleapis");
// require("dotenv").config();

import { google } from "googleapis";
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

youtube.commentThreads.list(
  {
    part: "snippet",
    videoId: "JTxsNm9IdYU",
  },
  (err, data) => {
    if (err) throw err;
    // console.log(data);
    const comments = data.data.items;

    // comments.forEach((comment) => {
    //   const text = comment.snippet.topLevelComment.snippet.textDisplay;
    //   console.log(text);
    // });
    let json = JSON.stringify(comments);
    fs.writeFile("comments.json", json, "utf8", (err) => {
      if (err) throw err;
      console.log("The file has been saved");
    });
  }
);
