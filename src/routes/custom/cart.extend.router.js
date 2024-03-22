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
    this.get("/", ["USER", "USER_PREMIUM"], getCartController);
    this.post("/", ["USER", "USER_PREMIUM"], postCartController);
    this.post("/:cartId/purchase", ["USER", "USER_PREMIUM"], finalizePurchase);
    this.put("/:id", ["USER", "USER_PREMIUM"], putCartController);
    this.delete("/:id", ["USER", "USER_PREMIUM"], deleteCartController);
  }
}
