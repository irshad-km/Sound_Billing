import Booking from "../models/Booking.js";
import Invoice from "../models/Invoice.js";
import Equipment from "../models/Equipment.js";
import Rental from "../models/Rental.js";

export const getDashboard = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer")
            .sort({ eventDate: 1 });

        const invoices = await Invoice.find();

        const equipment = await Equipment.find();

        const rentals = await Rental.find();

        res.render("index", {
            bookings,
            invoices,
            equipment,
            rentals
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load dashboard");
    }
};

