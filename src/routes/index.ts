import { Router } from "express";
import cardRoute from "./cardRoute.js";
import rechargeRoute from "./rechargeRoute.js";

const router = Router();

router.use( cardRoute );
router.use( rechargeRoute );

export default router;