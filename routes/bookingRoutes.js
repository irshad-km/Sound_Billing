import express from "express";

import {
    getBookings,
    createBooking,
    getBooking,
    updateBooking,
    deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", getBookings);

router.post("/add", createBooking);

router.get("/view/:id", getBooking);

router.post("/edit/:id", updateBooking);

router.post("/delete/:id", deleteBooking);

export default router;