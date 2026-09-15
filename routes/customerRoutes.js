import express from "express";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/", getCustomers);

router.post("/add", createCustomer);

router.post("/edit/:id", updateCustomer);

router.post("/delete/:id", deleteCustomer);

export default router;