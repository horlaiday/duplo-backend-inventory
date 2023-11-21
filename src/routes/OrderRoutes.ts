import { Router } from "express";
import { createOrder, getCreditScore, getOrderDetails } from "../controller/OrderController";
import { validateOrderRequest } from "../middleware/OrderMiddleware";


const router = Router();

router.post("/", validateOrderRequest, createOrder);

router.get("/credit-score/:businessId", getCreditScore);
router.get("/:businessId", getOrderDetails);

export default router;