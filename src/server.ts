import app from "./app.js";
import { env } from "./config/env.js";
import services from "./services/_index.js";
import { logger } from "./utils/logger.js";

async function bootstrap(){
  // connect redis
  services.redisService.connect();
  // expose to port 
  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} visit: http://localhost:3000`);
  });
}