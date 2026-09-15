import express from "express";

import {
    getPayments,
    createPayment,
    deletePayment
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getPayments);

router.post("/add", createPayment);

router.post("/delete/:id", deletePayment);

export default router;