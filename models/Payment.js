import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        paymentNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentDate: {
            type: Date,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI", "Bank Transfer", "Card", "Other"],
            required: true
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

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;