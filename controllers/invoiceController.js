import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";
import Rental from "../models/Rental.js";


/* =====================================================
   GET ALL INVOICES
===================================================== */

export const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: "booking",
                populate: {
                    path: "customer"
                }
            })
            .sort({ createdAt: -1 });

        const bookings = await Booking.find()
            .populate("customer")
            .sort({ eventDate: 1 });

        const rentals = await Rental.find();

        const bookingRentalTotals = {};

        for (const rental of rentals) {
            const bookingId = rental.booking.toString();

            bookingRentalTotals[bookingId] =
                (bookingRentalTotals[bookingId] || 0) +
                Number(rental.rentalAmount || 0);
        }

        console.log("Booking IDs:", bookings.map(b => b._id.toString()));
        console.log("Rental totals:", bookingRentalTotals);

        res.render("invoices", {
            invoices,
            bookings,
            bookingRentalTotals
        });
        console.log("RENTAL TOTALS:", bookingRentalTotals);

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load invoices");
    }
};


/* =====================================================
   CREATE INVOICE
===================================================== */

export const createInvoice = async (req, res) => {
    try {

        const {
            booking,
            transportCharge,
            labourCharge,
            extraCharge,
            discount
        } = req.body;


        /* =================================================
           FIND BOOKING
        ================================================= */

        const selectedBooking =
            await Booking.findById(booking);


        if (!selectedBooking) {

            return res.status(404).send(
                "Booking not found"
            );
        }


        /* =================================================
           GET RENTALS
        ================================================= */

        const rentals = await Rental.find({
            booking: selectedBooking._id
        });


        let rentalAmount = 0;


        for (const rental of rentals) {

            rentalAmount +=
                Number(rental.rentalAmount) || 0;
        }


        /* =================================================
           ADVANCE FROM BOOKING
        ================================================= */

        const advance =
            Number(selectedBooking.advance) || 0;


        /* =================================================
           OTHER CHARGES
        ================================================= */

        const transport =
            Number(transportCharge) || 0;

        const labour =
            Number(labourCharge) || 0;

        const extra =
            Number(extraCharge) || 0;

        const discountAmount =
            Number(discount) || 0;


        /* =================================================
           TOTAL
        ================================================= */

        const totalAmount = Number(
            Math.max(
                rentalAmount +
                transport +
                labour +
                extra -
                discountAmount,
                0
            ).toFixed(2)
        );


        /* =================================================
           BALANCE
        ================================================= */

        const balance = Number(
            Math.max(
                totalAmount - advance,
                0
            ).toFixed(2)
        );


        /* =================================================
           PAYMENT STATUS
        ================================================= */

        let paymentStatus = "Pending";


        if (
            advance >= totalAmount &&
            totalAmount > 0
        ) {

            paymentStatus = "Paid";

        } else if (advance > 0) {

            paymentStatus = "Partial";
        }


        /* =================================================
           INVOICE NUMBER
        ================================================= */

        const invoiceNumber =
            "INV-" + Date.now();


        /* =================================================
           CREATE
        ================================================= */

        await Invoice.create({

            invoiceNumber,

            booking,

            rentalAmount,

            transportCharge: transport,

            labourCharge: labour,

            extraCharge: extra,

            discount: discountAmount,

            totalAmount,

            advance,

            balance,

            paymentStatus

        });


        res.redirect("/invoices");


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to create invoice"
        );
    }
};


/* =====================================================
   GET SINGLE INVOICE
===================================================== */

export const getInvoice = async (req, res) => {
    try {

        const invoice =
            await Invoice.findById(req.params.id)
                .populate({
                    path: "booking",
                    populate: {
                        path: "customer"
                    }
                });


        if (!invoice) {

            return res.status(404).send(
                "Invoice not found"
            );
        }


        res.render("invoice-view", {
            invoice
        });


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to load invoice"
        );
    }
};


/* =====================================================
   UPDATE INVOICE
===================================================== */

export const updateInvoice = async (req, res) => {
    try {

        const {
            booking,
            transportCharge,
            labourCharge,
            extraCharge,
            discount
        } = req.body;


        /* =================================================
           FIND BOOKING
        ================================================= */

        const selectedBooking =
            await Booking.findById(booking);


        if (!selectedBooking) {

            return res.status(404).send(
                "Booking not found"
            );
        }


        /* =================================================
           GET RENTALS
        ================================================= */

        const rentals = await Rental.find({
            booking: selectedBooking._id
        });


        let rentalAmount = 0;


        for (const rental of rentals) {

            rentalAmount +=
                Number(rental.rentalAmount) || 0;
        }


        /* =================================================
           ADVANCE
        ================================================= */

        const advance =
            Number(selectedBooking.advance) || 0;


        /* =================================================
           OTHER CHARGES
        ================================================= */

        const transport =
            Number(transportCharge) || 0;

        const labour =
            Number(labourCharge) || 0;

        const extra =
            Number(extraCharge) || 0;

        const discountAmount =
            Number(discount) || 0;


        /* =================================================
           TOTAL
        ================================================= */

        const totalAmount = Number(
            Math.max(
                rentalAmount +
                transport +
                labour +
                extra -
                discountAmount,
                0
            ).toFixed(2)
        );


        /* =================================================
           BALANCE
        ================================================= */

        const balance = Number(
            Math.max(
                totalAmount - advance,
                0
            ).toFixed(2)
        );


        /* =================================================
           PAYMENT STATUS
        ================================================= */

        let paymentStatus = "Pending";


        if (
            advance >= totalAmount &&
            totalAmount > 0
        ) {

            paymentStatus = "Paid";

        } else if (advance > 0) {

            paymentStatus = "Partial";
        }


        /* =================================================
           UPDATE
        ================================================= */

        const invoice =
            await Invoice.findByIdAndUpdate(
                req.params.id,

                {
                    booking,

                    rentalAmount,

                    transportCharge: transport,

                    labourCharge: labour,

                    extraCharge: extra,

                    discount: discountAmount,

                    totalAmount,

                    advance,

                    balance,

                    paymentStatus
                },

                {
                    new: true,
                    runValidators: true
                }
            );


        if (!invoice) {

            return res.status(404).send(
                "Invoice not found"
            );
        }


        res.redirect("/invoices");


    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to update invoice"
        );
    }
};


/* =====================================================
   DELETE INVOICE
===================================================== */
