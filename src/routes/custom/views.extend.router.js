import CustomRouter from "./custom.router.js";
import { getAllUsersController } from "../../controllers/user.controller.js";
import { getProductController } from "../../controllers/product.controller.js";
import {
  finalizePurchase,
  getCartController,
} from "../../controllers/cart.controller.js";
import { productService } from "../../services/service.js";

export default class ViewsExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], (req, res) => {
      const cssFileName = "index.css";
      const jsFileName = "index.js";
      res.render("index", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
    });

    this.get("/register", ["PUBLIC"], (req, res) => {
      try {
        const cssFileName = "register.css";
        const jsFileName = "register.js";
        res.render("register", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
        });
      } catch (error) {
        res.status(500).json({ error: "Error interno del servidor." });
      }
    });

    this.get("/login", ["PUBLIC"], (req, res) => {
      const cssFileName = "login.css";
      const jsFileName = "login.js";
      res.render("login", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
    });

    this.get("/changeRole", ["ADMIN"], async (req, res) => {
      try {
        const cssFileName = "changeRole.css";
        const jsFileName = "changeRole.js";

        const users = await getAllUsersController(req, res);

        res.render("changeRole", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          users: users,
        });
      } catch (error) {
        res.status(500).json({ error: "Error interno del servidor." });
      }
    });

    this.get(
      "/products",
      ["USER", "USER_PREMIUM", "ADMIN"],
      async (req, res) => {
        const cssFileName = "products.css";
        const jsFileName = "products.js";

        try {
          const products = await getProductController(req, res);

          res.render("products", {
            cssFileName: cssFileName,
            jsFileName: jsFileName,
            products: products.items,
          });
        } catch (error) {
          console.log("estoy aca");
          // Manejar el error renderizando una página de error
          res.status(500).render("error", { error: error.message });
        }
      }
    );

    this.get("/cart", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const cssFileName = "cart.css";
        const jsFileName = "cart.js";

        const cart = await getCartController(req, res);

        const products = await Promise.all(
          cart.products.map(async (item) => {
            const product = await productService.findById(item.product._id);
            return { quantity: item.quantity, product };
          })
        );

        res.render("cart", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          carts: products,
          products: products,
          errorMessage: null,
        });
      } catch (error) {
        console.error("Error en la ruta /cart:", error);
        res.status(500).render("cart", {
          cssFileName: "error.css",
          jsFileName: "error.js",
          carts: null,
          products: null,
          errorMessage: "No se encontraron carritos.",
        });
      }
    });

    this.get(
      "/successPurchase",
      ["USER", "USER_PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const cssFileName = "successPurchase.css";
          const jsFileName = "successPurchase.js";

          const data = await finalizePurchase(req, res);

          res.render("successPurchase", {
            cssFileName: cssFileName,
            jsFileName: jsFileName,
            data: data,
          });
        } catch (error) {
          throw error;
        }
      }
    );

    this.get("/modifyProducts", ["ADMIN"], async (req, res) => {
      try {
        const cssFileName = "modifyProducts.css";
        const jsFileName = "modifyProducts.js";

        const products = await getProductController(req, res);

        res.render("modifyProducts", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          products: products.items,
        });
      } catch (error) {
        throw error;
      }
    });
  }
}
