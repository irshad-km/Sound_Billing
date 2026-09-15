import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate({
                path: "invoice",
                populate: {
                    path: "booking",
                    populate: {
                        path: "customer"
                    }
                }
            })
            .sort({ paymentDate: -1 });

        const invoices = await Invoice.find()
            .populate({
                path: "booking",
                populate: {
                    path: "customer"
                }
            })
            .sort({ createdAt: -1 });

        res.render("payments", {
            payments,
            invoices
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load payments");
    }
};


export const createPayment = async (req, res) => {
    try {
        const {
            invoice,
            amount,
            paymentDate,
            paymentMethod,
            notes
        } = req.body;

        const paymentAmount = Number(amount) || 0;

        if (paymentAmount <= 0) {
            return res.status(400).send("Invalid payment amount");
        }

        const selectedInvoice = await Invoice.findById(invoice);

        if (!selectedInvoice) {
            return res.status(404).send("Invoice not found");
        }

        if (paymentAmount > selectedInvoice.balance) {
            return res.status(400).send("Payment amount is greater than invoice balance");
        }

        const paymentNumber = "PAY-" + Date.now();

        await Payment.create({
            paymentNumber,
            invoice,
            amount: paymentAmount,
            paymentDate,
            paymentMethod,
            notes
        });

        const newAdvance = selectedInvoice.advance + paymentAmount;
        const newBalance = Math.max(
            selectedInvoice.totalAmount - newAdvance,
            0
        );

        let paymentStatus = "Pending";

        if (newBalance === 0 && selectedInvoice.totalAmount > 0) {
            paymentStatus = "Paid";
        } else if (newAdvance > 0) {
            paymentStatus = "Partial";
        }

        await Invoice.findByIdAndUpdate(invoice, {
            advance: newAdvance,
            balance: newBalance,
            paymentStatus
        });

        res.redirect("/payments");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create payment");
    }
};


export const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).send("Payment not found");
        }

        const invoice = await Invoice.findById(payment.invoice);

        if (invoice) {
            const newAdvance = Math.max(
                invoice.advance - payment.amount,
                0
            );

            const newBalance = Math.max(
                invoice.totalAmount - newAdvance,
                0
            );

            let paymentStatus = "Pending";

            if (newBalance === 0 && invoice.totalAmount > 0) {
                paymentStatus = "Paid";
            } else if (newAdvance > 0) {
                paymentStatus = "Partial";
            }

            await Invoice.findByIdAndUpdate(payment.invoice, {
                advance: newAdvance,
                balance: newBalance,
                paymentStatus
            });
        }

        await Payment.findByIdAndDelete(req.params.id);

        res.redirect("/payments");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete payment");
    }
};