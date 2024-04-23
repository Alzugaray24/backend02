import { cartModel } from "./models/carts.js";
import { productModel } from "./models/product.js";
import mongoose from "mongoose";

export default class CartServiceMongo {
  constructor() {
    console.log("Working with Carts using Database persistence in MongoDB");
  }

  getAll = async (user) => {
    try {
      if (!user.cart || user.cart.length === 0) {
        return null;
      }

      const cartId = user.cart[0];

      const cart = await cartModel.findById(cartId).lean();

      const cartProducts = await Promise.all(
        cart.products.map(async (product) => {
          const productData = await productModel.findById(product._id);
          return { quantity: product.quantity, product: productData };
        })
      );

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
      const newCart = await cartModel.create({ user: userId, products: [] });
      return newCart;
    } catch (error) {
      console.error("Error in create:", error);
      throw error;
    }
  };

  update = async (cartId, updatedCart) => {
    try {
      console.log(cartId);
      console.log(updatedCart);
      const result = await cartModel.findByIdAndUpdate(cartId, updatedCart, {
        new: true,
      });
      console.log("result: ");
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  };

  findByUserId = async (userId) => {
    try {
      const cart = await cartModel.findOne({ user: userId }).lean();
      return cart;
    } catch (error) {
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
      const cart = await cartModel.findById(id).lean();
      return cart;
    } catch (error) {
      console.error("Error in getCartById:", error);
      throw error;
    }
  };
}
