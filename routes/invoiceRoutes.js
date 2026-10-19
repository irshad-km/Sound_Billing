import express from "express";

import {
    getInvoices,
    createInvoice,
    getInvoice,
    updateInvoice,
} from "../controllers/invoiceController.js";


const router = express.Router();


/* =====================================================
   GET ALL INVOICES
===================================================== */

router.get("/", getInvoices);


/* =====================================================
   CREATE INVOICE
===================================================== */

router.post("/add", createInvoice);


/* =====================================================
   VIEW SINGLE INVOICE
===================================================== */

router.get("/view/:id", getInvoice);


/* =====================================================
   EDIT INVOICE
===================================================== */

router.post("/edit/:id", updateInvoice);





export default router;