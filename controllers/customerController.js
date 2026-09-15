import Customer from "../models/Customer.js";

// Show Customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({
            createdAt: -1
        });

        res.render("customers", {
            customers
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load customers");
    }
};


// Add Customer
export const createCustomer = async (req, res) => {
    try {
        const {
            name,
            phone,
            alternatePhone,
            email,
            address,
            place,
            notes
        } = req.body;

        const customer = new Customer({
            name,
            phone,
            alternatePhone,
            email,
            address,
            place,
            notes
        });

        await customer.save();

        res.redirect("/customers");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to save customer");
    }
};


// Edit Customer
export const updateCustomer = async (req, res) => {
    try {
        const {
            name,
            phone,
            alternatePhone,
            email,
            address,
            place,
            notes
        } = req.body;

        await Customer.findByIdAndUpdate(
            req.params.id,
            {
                name,
                phone,
                alternatePhone,
                email,
                address,
                place,
                notes
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.redirect("/customers");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update customer");
    }
};


// Delete Customer
export const deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);

        res.redirect("/customers");

    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete customer");
    }
};