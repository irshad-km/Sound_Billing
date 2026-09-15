import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

import customerRoutes from "./routes/customerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import rentalRoutes  from "./routes/rentalRoutes.js";
import invoiceRoutes  from "./routes/invoiceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();


const app = express();

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/", dashboardRoutes);


app.use("/customers", customerRoutes);
app.use("/events", bookingRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/rentals", rentalRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/payments", paymentRoutes);



app.listen(PORT, () => {
    console.log(`🎧 Sound Billing running at http://localhost:${PORT}`);
});