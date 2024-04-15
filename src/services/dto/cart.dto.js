import { productService } from "../service.js"; // Importa el servicio de productos aquí si es necesario
import mongoose from "mongoose";

export default class CartDTO {
  constructor(cart) {
    this.id = cart._id; // Suponiendo que `_id` es el campo de identificación del carrito en MongoDB
    this.products = cart.products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));
  }

  static async validateForCreate(cartData) {
    const { userId, productId, quantity } = cartData;
    const errors = [];

    // Verifica si el userId es válido
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      errors.push("Se requiere un ID de usuario válido.");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      errors.push("El ID proporcionado no es válido.");
      return errors;
    }

    // Verifica si el productId es válido
    if (
      !productId ||
      typeof productId !== "string" ||
      productId.trim() === ""
    ) {
      errors.push("Se requiere un ID de producto válido.");
    } else {
      // Verifica si el producto existe en la base de datos
      const productData = await productService.findById(productId);
      if (!productData) {
        errors.push(`El producto con ID ${productId} no existe.`);
      }
    }

    // Verifica si la cantidad es un número entero positivo
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push("La cantidad debe ser un número entero positivo.");
    }

    return errors;
  }

  static async validateForUpdate(cartData) {
    const { id, product, quantity } = cartData;
    const errors = [];

    // Verifica si se proporcionó un ID de carrito válido
    if (!id || typeof id !== "string" || id.trim() === "") {
      errors.push("Se requiere un ID de carrito válido.");
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      errors.push("El ID proporcionado no es válido.");
      return errors;
    }

    // Verifica si se proporcionó un producto válido
    if (!product || typeof product !== "string" || product.trim() === "") {
      errors.push("Se requiere un ID de producto válido.");
    } else {
      // Verifica si el producto existe en la base de datos
      const productData = await productService.findById(product);
      if (!productData) {
        errors.push(`El producto con ID ${product} no existe.`);
      }
    }

    console.log(errors);

    // Verifica si se proporcionó una cantidad válida
    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      errors.push("Se requiere una cantidad válida y positiva.");
    }

    return errors;
  }
}
