import { getCartController, postCartController, putCartController, deleteCartController } from "../../controllers/cart.controller.js";
import CustomRouter from './custom.router.js';

export default class CartExtendRouter extends CustomRouter {
    init() {
        this.get("/", ["PUBLIC"], getCartController);
        this.post("/", ["PUBLIC"], postCartController);
        this.put("/:id", ["PUBLIC"], putCartController);
        this.delete("/:id", ["PUBLIC"], deleteCartController);
    }
}
