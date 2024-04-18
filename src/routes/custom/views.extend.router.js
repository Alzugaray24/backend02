import CustomRouter from "./custom.router.js";
import { getAllUsersController } from "../../controllers/user.controller.js";
import { getProductController } from "../../controllers/product.controller.js";

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
  }
}
