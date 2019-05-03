import axios from "axios";
import MongoClient from "mongodb";
import assert from "assert";

export default class DbService {
  constructor(url, dbName) {
    this.url = url;
    this.dbName = dbName;
  }

  async getAllPokeData() {
    try {
      const client = await new MongoClient(this.url);
      console.log("Connected correctly to server");

      const db = client.db(this.dbName);
      db.createCollection("pokemon", {
        autoIndexId: true
      });
      await db.collection("pokemon").createIndex({ name: 1 }, { unique: true });

      // find meta data for each pokemon
      const meta = await db
        .collection("pData")
        .find({})
        .toArray();

      // use url from each meta data to fetch its pokemon details and save them
      await Promise.all(
        meta.forEach(async item => {
          try {
            const r = await axios(item.url);
            const y = await db.collection("pokemon").insert(r.data);
            console.log(y);
          } catch (err) {
            console.log(err);
          }
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getMetaData() {
    try {
      const client = await new MongoClient(this.url);

      await client.connect();
      console.log("Connected correctly to server");

      const db = client.db(this.dbName);
      await db
        .collection("pData")
        .createIndex({ name: 1, url: 1, poke_num: 1 }, { unique: true });

      let data, next, result, results;
      let pokeCount = 0;

      const insertData = async url => {
        result = await axios.get(url);

        data = result.data;
        next = data.next;
        results = data.results;

        const modified = results.map(data => {
          // extract pokemon number part of the url
          const [, str1] = data.url.split("pokemon/");
          const [str2] = str1.split("/");
          pokeCount = str2;

          return { ...data, poke_num: str2 };
        });
        const filtered = modified.filter(x => x.poke_num <= 151); // save pokemons until 151
        await db.collection("pData").insertMany(filtered);
      };
      // get pokemons until 151
      while (pokeCount <= 151) {
        if (next) {
          await insertData(next);
        } else {
          await insertData("https://pokeapi.co/api/v2/pokemon/");
        }
      }
    } catch (err) {
      console.log(err);
    }

    // Close connection
    client.close();
  }
}

// const url = "mongodb://localhost:27017";
// const dbName = pokemon
// const client = new MongoClient(url);
