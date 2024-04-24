import { cartModel } from "./models/carts.js";
import { productModel } from "./models/product.js";
import mongoose from "mongoose";

export default class CartServiceMongo {
  constructor() {}

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
      throw error;
    }
  };

  createEmptyCart = async () => {
    try {
      const newCart = await cartModel.create({
        user: new mongoose.Types.ObjectId(),
        products: [],
      });
      return newCart;
    } catch (error) {
      throw error;
    }
  };

  save = async (userId) => {
    try {
      const newCart = await cartModel.create({ user: userId, products: [] });
      return newCart;
    } catch (error) {
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
      throw error;
    }
  };

  update = async (cartId, updatedCart) => {
    try {
      const result = await cartModel.findByIdAndUpdate(cartId, updatedCart, {
        new: true,
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  findByUserId = async (userId) => {
    try {
      const cart = await cartModel.findOne({ user: userId }).lean();
      return cart;
    } catch (error) {
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
      throw error;
    }
  };
}
