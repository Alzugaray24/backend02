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

const prodLogger = winston.createLogger({
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
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [new winston.transports.Console({ level: "debug" })],
});

export const addLogger = (req, res, next) => {
  if (config.environment === "prod") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }

  next();
};
