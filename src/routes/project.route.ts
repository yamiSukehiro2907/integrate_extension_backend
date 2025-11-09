import express, { Router } from "express";
import endpointRoute from "./endpoint.route";

const router: Router = express.Router();

router.use("/endpoint", endpointRoute);

export default router;
