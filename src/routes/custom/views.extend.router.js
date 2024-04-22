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
        console.log(users);

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

        // Obtener los carritos del usuario
        const cart = await getCartController(req, res);

        console.log(cart);

        // Obtener los detalles completos de los productos en el carrito
        const products = await Promise.all(
          cart.products.map(async (item) => {
            const product = await productService.findById(item.product._id);
            return { quantity: item.quantity, product };
          })
        );

        console.log(products);

        // Renderizar la plantilla "cart" y pasar los datos de los carritos y productos
        res.render("cart", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          carts: products, // Pasar el carrito
          products: products, // Pasar los productos con sus detalles
          errorMessage: null, // Indicar que no hay error
        });
      } catch (error) {
        console.error("Error en la ruta /cart:", error);
        // Enviar una respuesta con estado 200 y un objeto de datos que indica el error
        res.status(200).render("cart", {
          cssFileName: "error.css",
          jsFileName: "error.js",
          carts: null, // No hay carritos
          products: null, // No hay productos
          errorMessage: "No se encontraron carritos.", // Mensaje de error personalizado
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

          // Obtener los datos pasados como parámetros de consulta en la URL
          const data = await finalizePurchase(req, res);
          console.log(data);

          // Renderizar la plantilla "cart" y pasar los datos de los carritos y productos
          res.render("successPurchase", {
            cssFileName: cssFileName,
            jsFileName: jsFileName, // Pasar los carritos con los detalles de los productos
            data: data,
          });
        } catch (error) {
          res.status(404).render("successPurchase", {
            cssFileName: "error.css",
            jsFileName: "error.js",
            error,
          });
        }
      }
    );

    this.get("/modifyProducts", ["ADMIN"], async (req, res) => {
      try {
        const cssFileName = "modifyProducts.css";
        const jsFileName = "modifyProducts.js";

        const products = await getProductController(req, res);
        console.log(products);

        // Renderizar la plantilla "cart" y pasar los datos de los carritos y productos
        res.render("modifyProducts", {
          cssFileName: cssFileName,
          jsFileName: jsFileName,
          products: products.items,
        });
      } catch (error) {
        console.log("hubo un error");
        throw error;
      }
    });
  }
}
