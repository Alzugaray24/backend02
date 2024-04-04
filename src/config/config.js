import dotenv from 'dotenv';
import program from '../process.js';

dotenv.config();

const mode = program.opts().mode;

let envFilePath;

switch (mode) {
    case 'prod':
        envFilePath = "./src/config/.env.production";
        break;
    case 'dev':
        envFilePath = "./src/config/.env.development";
        break;
    case 'test':
        envFilePath = "./src/config/.env.testing";
        break;
    default:
        throw new Error('Invalid mode specified');
}

dotenv.config({ path: envFilePath });

export default {
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    environment: mode
}
