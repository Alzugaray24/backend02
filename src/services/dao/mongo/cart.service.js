import { cartModel } from "./models/carts.js";
import mongoose from "mongoose";

export default class CartServiceMongo {
  constructor() {
    console.log("Working with Carts using Database persistence in MongoDB");
  }

  getAll = async (options) => {
    try {
      const { limit = 10, page = 1, user } = options || {};

      const filter = {};
      if (user) {
        filter.user = user;
      }

      const result = await cartModel
        .find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalItems = await cartModel.countDocuments(filter);

      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  };

  createEmptyCart = async () => {
    try {
      console.log("hola desde funcion");
      // Crea un nuevo carrito vacío en la base de datos
      const newCart = await cartModel.create({
        user: new mongoose.Types.ObjectId(),
        products: [],
      });
      return newCart;
    } catch (error) {
      console.error("Error in createEmptyCart:", error);
      throw error;
    }
  };

  save = async (userId) => {
    try {
      console.log("desde save");
      console.log(userId);
      const newCart = await cartModel.create({ user: userId, products: [] });
      console.log(newCart);
      return newCart;
    } catch (error) {
      console.error("Error in save:", error);
      throw error;
    }
  };

  findById = async (id) => {
    const result = await cartModel.findOne({ _id: id });
    return result;
  };

  create = async (userId) => {
    try {
      // Crea un nuevo carrito con el ID del usuario proporcionado
      const newCart = await cartModel.create({ user: userId, products: [] });
      return newCart;
    } catch (error) {
      // Si ocurre un error, lógalo y lanza una excepción
      console.error("Error in create:", error);
      throw error;
    }
  };

  update = async (cartId, updatedCart) => {
    try {
      console.log(cartId);
      console.log(updatedCart);
      // Usamos el método findByIdAndUpdate de Mongoose para actualizar el carrito por su ID
      const result = await cartModel.findByIdAndUpdate(cartId, updatedCart, {
        new: true,
      });
      console.log("result: ");
      console.log(result);
      return result; // Retornamos el carrito actualizado
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  };

  findByUserId = async (userId) => {
    try {
      // Busca el carrito por el ID del usuario en la base de datos
      const cart = await cartModel.findOne({ user: userId }).lean();
      return cart;
    } catch (error) {
      // Si ocurre un error, lógalo y lanza una excepción
      console.error("Error in findByUserId:", error);
      throw error;
    }
  };

  delete = async (id) => {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };
}
