
import express from "express";

import {
    getRentals,
    createRental,
    returnRental,
    deleteRental 
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/", getRentals);

router.post("/add", createRental);

router.post("/return/:id", returnRental);

router.post("/delete/:id", deleteRental );

export default router;
