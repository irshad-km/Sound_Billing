import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        equipment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        rentalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["Rented", "Returned"],
            default: "Rented"
        }
    },
    {
        timestamps: true
    }
);

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;