import { Router } from "express";
import { registerUser } from "../controllers/user.js";
import {loginuser}  from "../controllers/loginUser.js";
import { addToActivity } from "../controllers/addActivity.js";
import { getAllActivity } from "../controllers/getactivity.js";

const router = Router();

router.route("/login").post(loginuser);
router.route("/register").post(registerUser);
router.route("/add_to_activity").post(addToActivity);
router.route("/get_all_activity").get(getAllActivity);

export default router;