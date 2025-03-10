import { Router } from "express";
import { LoginPage,RegisterPage, HomePage,Logout,Feedback } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = Router()

router.route("/login").get(LoginPage)
router.route("/login").post(LoginPage)
router.route("/register").get(RegisterPage)
router.route("/register").post(RegisterPage)
router.route("/register").post(RegisterPage)
router.route("/home").get(authMiddleware,HomePage)
// router.get('/logout', authController.logout);//we can write like this also
router.route("/logout").get(authMiddleware,Logout)
router.route("/feedback").get(Feedback)
router.route("/feedback").post(Feedback)
export default router