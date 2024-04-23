import {
  getProductController,
  postProductController,
  putProductController,
  deleteProductController,
} from "../../controllers/product.controller.js";
import CustomRouter from "./custom.router.js";

export default class ProductExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN"], getProductController);
    this.post("/", ["ADMIN"], postProductController);
    this.put("/:id", ["ADMIN"], putProductController);
    this.delete("/:id", ["ADMIN"], deleteProductController);
  }
}
