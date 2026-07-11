import { createClient } from "redis";
import { env } from "../config/env.js";

class RedisService {
    // create client
  private client = createClient({
    url: env.REDIS_URL,
  });

//   set connection
  async connect() {
    this.client.on("error", (err) => {
      console.error("Redis Error:", err);
    });

    await this.client.connect();

    console.log("Redis Connected");
  }

//   get the client
  getClient() {
    return this.client;
  }
}

export default RedisService;