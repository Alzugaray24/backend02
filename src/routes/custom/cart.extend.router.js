import {
  getCartController,
  postCartController,
  putCartController,
  deleteCartController,
  finalizePurchase,
} from "../../controllers/cart.controller.js";
import CustomRouter from "./custom.router.js";

export default class CartExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], getCartController);
    this.post("/", ["USER", "USER_PREMIUM", "ADMIN"], postCartController);
    this.post("/purchase", ["USER", "USER_PREMIUM", "ADMIN"], finalizePurchase);
    this.put("/", ["USER", "USER_PREMIUM", "ADMIN"], putCartController);
    this.delete("/", ["USER", "USER_PREMIUM", "ADMIN"], deleteCartController);
  }
}
