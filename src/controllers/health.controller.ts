import { Request, Response } from "express";

export class HealthController {
  check(_req: Request, res: Response) {
    res.status(200).json({
      success: true,
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  }
}