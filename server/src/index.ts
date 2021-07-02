import { Server } from "./server";
import { Database } from "./Database";

const conString = process.env.MONGO_CONSTRING;

const server = new Server();
const database = new Database()

async function startup() {
  await database.connect(conString);
  await server.listen();
}

const _ = startup();
