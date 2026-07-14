import { Router } from "express";
import controller from "../controllers/_index.js";
const healthRoute = Router();

healthRoute.get("/", controller.healthController.check);

export default healthRoute;