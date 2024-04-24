import dotenv from "dotenv";
import program from "../process.js";

dotenv.config();

const mode = program.opts().mode;

let envFilePath;

switch (mode) {
  case "prod":
    envFilePath = "./src/config/.env.production";
    break;
  default:
    throw new Error("Invalid mode specified");
}

dotenv.config({ path: envFilePath });

export default {
  port: process.env.PORT_CODE,
  urlMongo: process.env.URL_MONGO,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  environment: mode,
  passNodemailer: process.env.PASSWORD_NODEMAILER,
  emailNodemailer: process.env.EMAIL_NODEMAILER,
};
