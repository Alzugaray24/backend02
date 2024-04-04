import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import MongoSingleton from "./config/mongodb-singleton.js";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

// Vistas
import viewsRoutes from "./routes/views.routes.js";

// logger
import { addLogger } from "./config/logger_custom.js";

// errorHandler
import errorHandler from "./services/middlewares/errorHandler.js";

// Custom Extended
import UsersExtendRouter from "./routes/custom/users.extend.router.js";
import ProductExtendRouter from "./routes/custom/product.extend.router.js";
import CartExtendRouter from "./routes/custom/cart.extend.router.js";

// Passport imports
import passport from "passport";
import initializePassport from "./config/passport.config.js";

// Esto sirve para recorrer arrays en handlebars
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

const app = express();

// Configuración de Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

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

// Declaramos la Api donde vamos a tener la parte grafica
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

//Cookies
//router.use(cookieParser());
app.use(cookieParser("CoderS3cr3tC0d3"));

// Middleware de passport
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());

// Configuracion de Express
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// // Uso de loggers
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

//TODO: MongoSingleton
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
mongoInstance();
