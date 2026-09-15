import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer")
            .sort({
                eventDate: -1
            });

        const customers = await Customer.find().sort({
            name: 1
        });

        res.render("events", {
            bookings,
            customers
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load events");
    }
};



export const createBooking = async (req, res) => {
    try {
        const {
            customer,
            eventType,
            eventDate,
            location,
            totalAmount,
            advance,
            paymentStatus,
            notes
        } = req.body;

        const total = Number(totalAmount) || 0;
        const paid = Number(advance) || 0;

        const balance = Math.max(total - paid, 0);

        await Booking.create({
            customer,
            eventType,
            eventDate,
            location,
            totalAmount: total,
            advance: paid,
            balance,
            paymentStatus,
            notes
        });

        res.redirect("/events");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create booking");
    }
};


export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("customer");

        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        res.json(booking);

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load booking");
    }
};

export const updateBooking = async (req, res) => {
    try {
        const {
            customer,
            eventType,
            eventDate,
            location,
            totalAmount,
            advance,
            paymentStatus,
            notes
        } = req.body;

        const total = Number(totalAmount) || 0;
        const paid = Number(advance) || 0;

        const balance = Math.max(total - paid, 0);

        await Booking.findByIdAndUpdate(
            req.params.id,
            {
                customer,
                eventType,
                eventDate,
                location,
                totalAmount: total,
                advance: paid,
                balance,
                paymentStatus,
                notes
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/events");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update booking");
    }
};

export const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);

        res.redirect("/events");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete booking");
    }
};