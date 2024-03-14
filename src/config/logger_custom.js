import winston from "winston";
import config from "./config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 5,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    http: "red",
    info: "blue",
    debug: "white",
  },
};

// Logger en env desarrollo
const prodLogger = winston.createLogger({
  // Declaramos el trasnport
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error", //Cambiamos el logger level name.
      format: winston.format.simple(),
    }),
  ],
});

// Logger en env prod
const devLogger = winston.createLogger({
  // Declaramos el trasnport
  levels: customLevelsOptions.levels,
  transports: [new winston.transports.Console({ level: "debug" })],
});

// Declaramos a middleware
export const addLogger = (req, res, next) => {
  if (config.environment === "prod") {
    req.logger = prodLogger
  }else{
    req.logger = devLogger
  }
    
  next();
};
