import express from "express";

import { deleteTrip, generateTrip, getAllTrips, nextStop, savePlannedTrip, startTrip } from "../controllers/tripController.js";

const router = express.Router();

router.get("/all", getAllTrips);
router.post("/generate", generateTrip);
router.post("/save", savePlannedTrip);
router.post("/:tripId/start", startTrip);
router.post("/:tripId/next", nextStop);
router.delete("/:id", deleteTrip);

export default router;
