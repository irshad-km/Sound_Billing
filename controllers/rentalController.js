import Rental from "../models/Rental.js";
import Booking from "../models/Booking.js";
import Equipment from "../models/Equipment.js";

export const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find()
            .populate("booking")
            .populate("equipment")
            .sort({ createdAt: -1 });

        const bookings = await Booking.find()
            .populate("customer")
            .sort({ eventDate: 1 });

        const equipments = await Equipment.find()
            .sort({ name: 1 });

        res.render("rentals", {
            rentals,
            bookings,
            equipments
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load rentals");
    }
};

export const createRental = async (req, res) => {
    try {
        const {
            booking,
            equipment,
            quantity,
            rentalAmount
        } = req.body;

        const qty = Number(quantity) || 0;
        const amount = Number(rentalAmount) || 0;

        const item = await Equipment.findById(equipment);

        if (!item) {
            return res.status(404).send("Equipment not found");
        }

        if (qty > item.availableQuantity) {
            return res.status(400).send("Not enough equipment available");
        }

        await Rental.create({
            booking,
            equipment,
            quantity: qty,
            rentalAmount: amount,
            status: "Rented"
        });

        item.availableQuantity -= qty;
        item.rentedQuantity += qty;

        await item.save();

        res.redirect("/rentals");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create rental");
    }
};

export const returnRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).send("Rental not found");
        }

        if (rental.status === "Returned") {
            return res.redirect("/rentals");
        }

        const equipment = await Equipment.findById(rental.equipment);

        if (equipment) {
            equipment.availableQuantity += rental.quantity;
            equipment.rentedQuantity = Math.max(
                equipment.rentedQuantity - rental.quantity,
                0
            );

            await equipment.save();
        }

        rental.status = "Returned";

        await rental.save();

        res.redirect("/rentals");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to return rental");
    }
};