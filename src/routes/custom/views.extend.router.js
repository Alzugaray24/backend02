import CustomRouter from "./custom.router.js";
import { getAllUsersController } from "../../controllers/user.controller.js";
import { getProductController } from "../../controllers/product.controller.js";
import { getCartController } from "../../controllers/cart.controller.js";
import { productModel } from "../../services/dao/mongo/models/product.js";

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
      const cssFileName = "register.css";
      const jsFileName = "register.js";
      res.render("register", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
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

        // Esperar a que se resuelva la promesa y obtener los datos de usuario
        const users = await getAllUsersController(req, res);

        // Renderizar la vista con los datos de usuario
        res.render("changeRole", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          users: users,
        });
      } catch (error) {
        // Manejar el error si la promesa es rechazada
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor." });
      }
    });

    this.get(
      "/products",
      ["USER", "USER_PREMIUM", "ADMIN"],
      async (req, res) => {
        const cssFileName = "products.css";
        const jsFileName = "products.js";
        const products = await getProductController(req, res);
        console.log(products);

        res.render("products", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          products: products.items,
        });
      }
    );

    this.get("/cart", ["USER", "USER_PREMIUM", "ADMIN"], async (req, res) => {
      try {
        const cssFileName = "cart.css";
        const jsFileName = "cart.js";
        const cssEmptyCart = "cssEmptyCart.css";

        // Obtener los carritos del usuario
        const carts = await getCartController(req, res);

        console.log(carts);

        if (!carts || carts.length === 0) {
          // Renderizar una versión de la plantilla sin datos de carrito
          return res.render("cart_empty", { cssEmptyCart: cssEmptyCart });
        }

        // Renderizar la plantilla "cart" y pasar los datos de los carritos y productos
        res.render("cart", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          carts: carts, // Pasar los carritos con los detalles de los productos
        });
      } catch (error) {
        console.error("Error en la ruta /cart:", error);
        // Manejar el error adecuadamente
        res.status(500).send("Error en la ruta /cart");
      }
    });

    this.get(
      "/successPurchase",
      ["USER", "USER_PREMIUM", "ADMIN"],
      async (req, res) => {
        try {
          const cssFileName = "successPurchase.css";
          const jsFileName = "successPurchase.js";

          // Obtener los datos pasados como parámetros de consulta en la URL
          const data = JSON.parse(req.query.data);
          console.log(data.message);

          // Renderizar la plantilla "cart" y pasar los datos de los carritos y productos
          res.render("successPurchase", {
            cssFileName: cssFileName,
            jsFileName: jsFileName, // Pasar los carritos con los detalles de los productos
            data: data,
          });
        } catch (error) {
          console.error("Error en la ruta /cart:", error);
          // Manejar el error adecuadamente
          res.status(500).send("Error en la ruta /cart");
        }
      }
    );
  }
}
