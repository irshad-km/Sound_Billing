import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        eventType: {
            type: String,
            required: true,
            trim: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        location: {
            type: String,
            required: true,
            trim: true
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
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;