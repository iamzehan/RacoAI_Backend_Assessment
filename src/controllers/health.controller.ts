import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { createClient } from "redis";
import { env } from "../config/env.js";

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
      const client = createClient({
        url: env.REDIS_URL
      });

      await client.connect();
      await client.ping();
      await client.destroy();

      services.redis = "healthy";
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
