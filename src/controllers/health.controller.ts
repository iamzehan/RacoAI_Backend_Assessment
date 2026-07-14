import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import service from "../services/_index.js";

export class HealthController {
  async check(_req: Request, res: Response) {
    const services = {
      api: "healthy",
      database: "unhealthy",
      redis: "unhealthy"
    };

    let overallStatus = 200;

    // PostgreSQL
    try {
      await prisma.$queryRaw`SELECT 1`;
      services.database = "healthy";
    } catch {
      overallStatus = 503;
    }

    // Redis
    try {
      const redis = service.redisService;
      await redis.connect();
      const result = await redis.ping();
      await redis.destroy();

      services.redis = result? "healthy" : "unhealthy";
    } catch {
      overallStatus = 503;
    }

    res.status(overallStatus).json({
      success: overallStatus === 200,
      status: overallStatus === 200 ? "OK" : "DEGRADED",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services
    });
  }
}
