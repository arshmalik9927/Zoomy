import { Router } from "express";
import { createMeeting } from "../controllers/meeting.js";

const router=Router();

router.post("/create",createMeeting);

export default router;