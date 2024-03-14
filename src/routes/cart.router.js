import { Router } from "express";
import  { getCartController, postCartController, putCartController, deleteCartController } from "../controllers/cart.controller.js";
const router = Router();

router.get("/", getCartController);
router.post("/", postCartController);
router.put("/:id", putCartController);
router.delete("/:id", deleteCartController);

export default router;
