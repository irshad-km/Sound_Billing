import express from "express";

import {
    getInvoices,
    createInvoice,
    getInvoice,
    updateInvoice,
    deleteInvoice
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/", getInvoices);

router.post("/add", createInvoice);

router.get("/view/:id", getInvoice);

router.post("/edit/:id", updateInvoice);

router.post("/delete/:id", deleteInvoice);

export default router;