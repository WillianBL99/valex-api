import { Router } from "express";
import cardRoute from "./cardRoute.js";
import paymentRoute from "./paymentRoute.js";
import rechargeRoute from "./rechargeRoute.js";

const router = Router();

router.use( cardRoute );
router.use( paymentRoute );
router.use( rechargeRoute );

export default router;