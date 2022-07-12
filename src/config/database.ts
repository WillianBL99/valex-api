import pg, { ClientConfig } from "pg";

import AppLog from "../events/AppLog.js";
import "./setup.js";

const { Client } = pg;
const connectionString = process.env.DATABASE_URL ?? "";
const databaseConfig: ClientConfig = { connectionString };

if (process.env.MODE === "PROD") {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const client = new Client(databaseConfig);
exec();
export default client;

async function exec() {
  try {
    await client.connect();
    AppLog("Server", "Connected to database");
  } catch (error) {
    AppLog("Error", `Internal error while connecting to database | ${error}`);
  }
}
