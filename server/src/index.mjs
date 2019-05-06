import DbService from "./DbService.mjs";
import express from "express";
import MongoClient from "mongodb";
import bodyParser from "body-parser";

const app = express();

const url = "mongodb://localhost:27017";
const dbName = "pokemon";
// const client = new MongoClient(url);

const dbInstance = new DbService(url, dbName);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  //   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  next();
});

app.get("/pokemon", async (req, res) => {
  await dbInstance.getPokemons(req, res);
});

app.listen("3000", () => {
  console.log("listening on 3000");
});

// test
// (async () => {
//   try {
//     const client = await new MongoClient(url);
//     console.log("Connected correctly to server");

//     const db = client.db(dbName);

//     const result = await db
//       .collection("pokemon")
//       .find({}, { projection: { name: 1, id: 1, stats: 1 } })
//       .toArray();
//     console.log(result);

//   } catch (err) {
//     console.log(err);
//   }
// })();
