import { Router } from "express";
import { LoginPage,HomePage,Logout,PatientList,PatientQueryList } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router()

export default router

router.route("/login").get(LoginPage)
router.route("/login").post(LoginPage)
router.route("/home").get(adminMiddleware,HomePage)
router.route("/logout").get(adminMiddleware,Logout)
router.route("/patient-list").get(adminMiddleware,PatientList)
router.route("/patient-queries").get(adminMiddleware,PatientQueryList)