
import Booking from "../models/Booking.js";
import Invoice from "../models/Invoice.js";
import Equipment from "../models/Equipment.js";
import Rental from "../models/Rental.js";

export const getDashboard = async (req, res) => {
    try {
        // Get all bookings
        const bookings = await Booking.find()
            .populate("customer")
            .sort({ eventDate: 1 });

        // Get all invoices
        const invoices = await Invoice.find()
            .populate("booking");

        // Get all equipment
        const equipment = await Equipment.find()
            .sort({ name: 1 });

        // Get all rentals
        const rentals = await Rental.find()
            .populate("equipment")
            .populate("booking")
            .sort({ createdAt: -1 });

        // Today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today's bookings
        const todayBookings = bookings.filter((booking) => {
            if (!booking.eventDate) return false;

            const eventDate = new Date(booking.eventDate);

            return eventDate >= today && eventDate < tomorrow;
        });

        // Total invoice revenue
        const totalRevenue = invoices.reduce(
            (sum, invoice) =>
                sum + Number(invoice.totalAmount || 0),
            0
        );

        // Total amount collected
        // Invoice.advance includes the advance and payments
        // recorded against that invoice.
        const totalCollected = invoices.reduce(
            (sum, invoice) =>
                sum + Number(invoice.advance || 0),
            0
        );

        // Total outstanding balance
        const totalOutstanding = invoices.reduce(
            (sum, invoice) =>
                sum + Number(invoice.balance || 0),
            0
        );

        // Collection percentage
        const collectionRate = totalRevenue > 0
            ? (totalCollected / totalRevenue) * 100
            : 0;

        // Equipment currently outside
        const equipmentOut = equipment.reduce(
            (sum, item) =>
                sum + Number(item.rentedQuantity || 0),
            0
        );

        // Upcoming events
        const upcomingEvents = bookings
            .filter((booking) => {
                if (!booking.eventDate) return false;

                return new Date(booking.eventDate) >= today;
            })
            .sort(
                (a, b) =>
                    new Date(a.eventDate) -
                    new Date(b.eventDate)
            )
            .slice(0, 5);

        // Overdue invoices
        const overdueInvoices = invoices.filter((invoice) => {
            if (!invoice.booking) return false;
            if (!invoice.booking.eventDate && !invoice.createdAt) {
                return false;
            }

            const balance = Number(invoice.balance || 0);

            // Only unpaid invoices with a positive balance
            // are considered outstanding.
            if (balance <= 0) return false;

            // Your Invoice model does not currently have a dueDate.
            // Until one is added, use the booking event date
            // as a provisional overdue date.
            const eventDate = invoice.booking.eventDate;

            if (!eventDate) return false;

            const dueDate = new Date(eventDate);
            dueDate.setHours(0, 0, 0, 0);

            return dueDate < today;
        });

        // Invoices with outstanding balances
        const pendingPaymentsCount = invoices.filter(
            (invoice) => Number(invoice.balance || 0) > 0
        ).length;

        // Render dashboard
        res.render("index", {
            bookings,
            invoices,
            equipment,
            rentals,

            todayBookings,
            totalRevenue,
            totalCollected,
            totalOutstanding,
            collectionRate,
            equipmentOut,
            upcomingEvents,
            overdueInvoices,
            pendingPaymentsCount
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).send("Failed to load dashboard");
    }
};

