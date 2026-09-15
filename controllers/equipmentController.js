import Equipment from "../models/Equipment.js";

export const getEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find()
            .sort({ createdAt: -1 });

        res.render("equipment", { equipments });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load equipment");
    }
};


export const createEquipment = async (req, res) => {
    try {

        const {
            name,
            category,
            brand,
            model,
            totalQuantity,
            purchasePrice,
            rentalPrice,
            condition,
            notes
        } = req.body;


        const total = Number(totalQuantity) || 0;


        await Equipment.create({

            name,
            category,
            brand,
            model,

            totalQuantity: total,

            availableQuantity: total,

            rentedQuantity: 0,

            purchasePrice:
                Number(purchasePrice) || 0,

            rentalPrice:
                Number(rentalPrice) || 0,

            condition,

            notes

        });


        res.redirect("/equipment");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to save equipment"
        );

    }
};


export const updateEquipment = async (req, res) => {
    try {

        const {
            name,
            category,
            brand,
            model,
            totalQuantity,
            purchasePrice,
            rentalPrice,
            condition,
            notes
        } = req.body;


        const equipment =
            await Equipment.findById(req.params.id);


        if (!equipment) {

            return res
                .status(404)
                .send("Equipment not found");

        }


        const newTotal =
            Number(totalQuantity) || 0;


        const rented =
            equipment.rentedQuantity;


        const newAvailable =
            Math.max(newTotal - rented, 0);


        equipment.name = name;

        equipment.category = category;

        equipment.brand = brand;

        equipment.model = model;

        equipment.totalQuantity = newTotal;

        equipment.availableQuantity =
            newAvailable;

        equipment.purchasePrice =
            Number(purchasePrice) || 0;

        equipment.rentalPrice =
            Number(rentalPrice) || 0;

        equipment.condition =
            condition;

        equipment.notes =
            notes;


        await equipment.save();


        res.redirect("/equipment");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to update equipment"
        );

    }
};


export const deleteEquipment = async (req, res) => {
    try {

        await Equipment.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/equipment");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to delete equipment"
        );

    }
};