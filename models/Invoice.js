import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        rentalAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        transportCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        labourCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        extraCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        advance: {
            type: Number,
            default: 0,
            min: 0
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Partial", "Paid"],
            default: "Pending"
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;