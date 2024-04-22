import { cartModel } from "./models/carts.js";
import { productModel } from "./models/product.js";
import mongoose from "mongoose";

export default class CartServiceMongo {
  constructor() {
    console.log("Working with Carts using Database persistence in MongoDB");
  }

  getAll = async (user) => {
    try {
      // Verifica si el usuario tiene un carrito asociado
      if (!user.cart || user.cart.length === 0) {
        return null; // Retorna null si el usuario no tiene carrito
      }

      // Obtiene el ID del carrito asociado al usuario
      const cartId = user.cart[0]; // Suponiendo que solo hay un carrito por usuario

      // Busca el carrito por su ID
      const cart = await cartModel.findById(cartId).lean();

      // Obtener los ids de los productos en una nueva constante
      const cartProducts = await Promise.all(
        cart.products.map(async (product) => {
          const productData = await productModel.findById(product._id);
          return { quantity: product.quantity, product: productData };
        })
      );

      // Reemplazar los productos con sus datos completos y cantidad
      cart.products = cartProducts;

      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito para el usuario:", error);
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

  getCartById = async (id) => {
    try {
      // Busca el carrito por su ID en la base de datos
      const cart = await cartModel.findById(id).lean();
      return cart;
    } catch (error) {
      // Si ocurre un error, lógalo y lanza una excepción
      console.error("Error in getCartById:", error);
      throw error;
    }
  };
}
