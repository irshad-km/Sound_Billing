import express from "express";

import {
    getEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment
} from "../controllers/equipmentController.js";

const router = express.Router();


// Equipment list
router.get("/", getEquipments);


// Add equipment
router.post("/add", createEquipment);


// Edit equipment
router.post("/edit/:id", updateEquipment);


// Delete equipment
router.post("/delete/:id", deleteEquipment);


export default router;