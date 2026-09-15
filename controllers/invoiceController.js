import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";
import Rental from "../models/Rental.js";

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

        res.render("invoices", {
            invoices,
            bookings
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load invoices");
    }
};


export const createInvoice = async (req, res) => {
    try {

        const {
            booking,
            rentalAmount,
            transportCharge,
            labourCharge,
            extraCharge,
            discount,
            advance,
            notes
        } = req.body;


        const rental = Number(rentalAmount) || 0;
        const transport = Number(transportCharge) || 0;
        const labour = Number(labourCharge) || 0;
        const extra = Number(extraCharge) || 0;
        const discountAmount = Number(discount) || 0;
        const paid = Number(advance) || 0;


        const totalAmount = Number(
            Math.max(
                rental +
                transport +
                labour +
                extra -
                discountAmount,
                0
            ).toFixed(2)
        );

        const balance = Number(
            Math.max(
                totalAmount - paid,
                0
            ).toFixed(2)
        );


        let paymentStatus = "Pending";

        if (paid >= totalAmount && totalAmount > 0) {
            paymentStatus = "Paid";
        } else if (paid > 0) {
            paymentStatus = "Partial";
        }


        const invoiceNumber =
            "INV-" +
            Date.now();


        await Invoice.create({

            invoiceNumber,

            booking,

            rentalAmount: rental,

            transportCharge: transport,

            labourCharge: labour,

            extraCharge: extra,

            discount: discountAmount,

            totalAmount,

            advance: paid,

            balance,

            paymentStatus,

            notes

        });


        res.redirect("/invoices");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to create invoice"
        );

    }
};


export const getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
                path: "booking",
                populate: {
                    path: "customer"
                }
            });

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        res.render("invoice-view", {
            invoice
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load invoice");
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const {
            booking,
            rentalAmount,
            transportCharge,
            labourCharge,
            extraCharge,
            discount,
            advance,
            notes
        } = req.body;

        const rental = Number(rentalAmount) || 0;
        const transport = Number(transportCharge) || 0;
        const labour = Number(labourCharge) || 0;
        const extra = Number(extraCharge) || 0;
        const discountAmount = Number(discount) || 0;
        const paid = Number(advance) || 0;

        const totalAmount = Math.max(
            rental +
            transport +
            labour +
            extra -
            discountAmount,
            0
        );

        const balance = Math.max(
            totalAmount - paid,
            0
        );

        let paymentStatus = "Pending";

        if (paid >= totalAmount && totalAmount > 0) {
            paymentStatus = "Paid";
        } else if (paid > 0) {
            paymentStatus = "Partial";
        }

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                booking,
                rentalAmount: rental,
                transportCharge: transport,
                labourCharge: labour,
                extraCharge: extra,
                discount: discountAmount,
                totalAmount,
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

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        res.redirect("/invoices");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update invoice");
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        res.redirect("/invoices");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete invoice");
    }
};