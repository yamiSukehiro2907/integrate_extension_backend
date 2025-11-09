import express, { Router } from "express";
import { getAllEndpoints } from "../controllers/project.controller";

const router: Router = express.Router();

router.get("/", getAllEndpoints);

export default router;
