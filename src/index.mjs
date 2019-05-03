import MongoClient from "mongodb";
import assert from "assert";
import axios from "axios";
import DbService from "./DbService.mjs";

const url = "mongodb://localhost:27017";
const dbName = "pokemon";
// const client = new MongoClient(url);

const dbInstance = new DbService(url, dbName);
dbInstance.getAllPokeData();
