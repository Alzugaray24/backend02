import mongoose from "mongoose";
import config from "./config.js";

class MongoSingleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (this.#instance) {
    } else {
      this.#instance = new MongoSingleton();
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(
        process.env.URL_MONGO ||
          "mongodb+srv://CoderUser:123@codercluster.tnznf0l.mongodb.net/CoderCluster?retryWrites=true&w=majority"
      );
    } catch (error) {
      console.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
    }
  };
}

export default MongoSingleton;
