import mongoose from "mongoose";


const invoiceSchema = new mongoose.Schema(
    {

        /* =================================================
           INVOICE NUMBER
        ================================================= */

        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        /* =================================================
           BOOKING
        ================================================= */

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },


        /* =================================================
           RENTAL AMOUNT
        ================================================= */

        rentalAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           TRANSPORT
        ================================================= */

        transportCharge: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           LABOUR
        ================================================= */

        labourCharge: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           EXTRA
        ================================================= */

        extraCharge: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           DISCOUNT
        ================================================= */

        discount: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           TOTAL
        ================================================= */

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },


        /* =================================================
           ADVANCE
        ================================================= */

        advance: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           BALANCE
        ================================================= */

        balance: {
            type: Number,
            default: 0,
            min: 0
        },


        /* =================================================
           PAYMENT STATUS
        ================================================= */

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Partial",
                "Paid"
            ],
            default: "Pending"
        }

    },

    {
        timestamps: true
    }
);


const Invoice =
    mongoose.model(
        "Invoice",
        invoiceSchema
    );


export default Invoice;