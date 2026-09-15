import express from "express";

import {
    getRentals,
    createRental,
    returnRental
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/", getRentals);

router.post("/add", createRental);

router.post("/return/:id", returnRental);

export default router;