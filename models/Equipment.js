import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true,
            default: ""
        },

        model: {
            type: String,
            trim: true,
            default: ""
        },

        totalQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        availableQuantity: {
            type: Number,
            required: true,
            min: 0
        },

        rentedQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        purchasePrice: {
            type: Number,
            default: 0,
            min: 0
        },

        rentalPrice: {
            type: Number,
            default: 0,
            min: 0
        },

        condition: {
            type: String,
            enum: ["Good", "Fair", "Damaged"],
            default: "Good"
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

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;