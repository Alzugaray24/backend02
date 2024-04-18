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
    this.get("/", ["PUBLIC"], getCartController);
    this.post("/", ["PUBLIC"], postCartController);
    this.post("/purchase", ["PUBLIC"], finalizePurchase);
    this.put("/", ["PUBLIC"], putCartController);
    this.delete("/", ["PUBLIC"], deleteCartController);
  }
}
