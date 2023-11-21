import { Router } from "express";
import { createBusiness, getBusinesses } from "../controller/BusinessController";
const router = Router();

router.post("/", createBusiness);

router.get("/", getBusinesses);


export default router;
