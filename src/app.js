// app.js
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import MongoSingleton from "./config/mongodb-singleton.js";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import { addLogger } from "./config/logger_custom.js";
import errorHandler from "./services/middlewares/errorHandler.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import viewsRoutes from "./routes/views.routes.js";

import UsersExtendRouter from "./routes/custom/users.extend.router.js";
import ProductExtendRouter from "./routes/custom/product.extend.router.js";
import CartExtendRouter from "./routes/custom/cart.extend.router.js";

// import Handlebars from "handlebars";
// import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const app = express();

// Configuracion de handlebars

// app.engine(
//   "hbs",
//   handlebars.engine({
//     extname: "hbs",
//     defaultLayout: "main",
//     handlebars: allowInsecurePrototypeAccess(Handlebars),
//   })
// );

// app.set("view engine", "hbs");
// app.set("views", `${__dirname}/views`);
// app.use(express.static(`${__dirname}/public`));

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion API Adopme",
      description: "Documentacion para uso de swagger",
    },
  },
  apis: [`./src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

app.use(cookieParser("CoderS3cr3tC0d3"));

initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(addLogger);

app.use("/", viewsRoutes);

const usersExtendRouter = new UsersExtendRouter();
const productExtendRouter = new ProductExtendRouter();
const cartExtendRouter = new CartExtendRouter();

app.use("/api/extend/users", usersExtendRouter.getRouter());
app.use("/api/extend/products", productExtendRouter.getRouter());
app.use("/api/extend/cart", cartExtendRouter.getRouter());

app.use(errorHandler);

const SERVER_PORT = config.port;

app.listen(SERVER_PORT, console.log(`Server running on port ${SERVER_PORT}`));

const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
mongoInstance();
