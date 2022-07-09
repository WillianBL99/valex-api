import { Router } from "express";
import cardRoute from "./cardRoute.js";

const router = Router();

router.use( cardRoute );

export default router;