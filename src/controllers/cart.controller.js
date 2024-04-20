import { cartService } from "../services/service.js";
import { productService } from "../services/service.js";
import { ticketService } from "../services/service.js";
import { generateTicketCode, calculateTotalAmount } from "../dirname.js";
import { userService } from "../services/service.js";
import mongoose from "mongoose";
import { getUserIdFromToken } from "../dirname.js";
import { sendPurchaseSuccessEmail } from "../dirname.js";

export const getCartController = async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = getUserIdFromToken(token);

    const user = await userService.findById(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 404;
      throw error;
    }

    // Obtener todos los carritos del usuario con los detalles de los productos asociados utilizando el servicio
    const carts = await cartService.getAll(user);

    if (!carts || carts.length === 0) {
      const error = new Error("No se encontraron carritos.");
      error.status = 404;
      throw error;
    }

    return carts;
  } catch (error) {
    // Registra el error
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los carritos:`,
      error
    );

    // Captura el error y lo pasa al controlador que lo invocó
    throw error;
  }
};

export const postCartController = async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = getUserIdFromToken(token);
    const { productId, quantity } = req.body;

    // Buscar al usuario por su ID
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    let cartId;
    if (user.cart.length === 0) {
      // Si el usuario no tiene un carrito existente, generar un nuevo ID
      cartId = mongoose.Types.ObjectId();
      // Agregar el nuevo ID al array user.cart
      user.cart.push(cartId);
    } else {
      // Si el usuario tiene un carrito existente, obtener su ID
      cartId = user.cart[0];
    }

    // Buscar el carrito por su ID
    let cart = await cartService.findById(cartId);
    if (!cart) {
      // Si el carrito no existe, crear uno nuevo con el ID generado
      cart = await cartService.create({ _id: cartId, products: [] });
    }

    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) => item._id.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({ _id: productId, quantity });
    }

    // Guardar los cambios en el carrito
    await cartService.update(cart._id, cart);

    // Actualizar el usuario con el carrito modificado
    await userService.update(userId, { cart: [cart._id] });

    return res.status(201).json({
      message: "Producto agregado al carrito exitosamente.",
      cart: cart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity } = req.body;

    // Buscar al usuario por su ID
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Obtener el ID del carrito del usuario
    const cartId = user.cart[0];

    // Obtener el carrito actual
    const cart = await cartService.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Actualizar la cantidad del producto en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === product.toString()
    );
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      cart.products[existingProductIndex].quantity = quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo con la cantidad especificada
      cart.products.push({ product, quantity });
    }

    // Guardar el carrito actualizado
    await cartService.update(cartId, cart);

    // Actualizar el usuario con el carrito modificado
    user.cart[0] = cart._id;
    await userService.update(userId, { cart: user.cart });

    req.logger.info(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Carrito actualizado con éxito.`
    );
    res.status(200).json({
      status: "success",
      updatedCart: cart,
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Error al actualizar el carrito:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Buscar al usuario por su ID
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Obtener el ID del carrito del usuario
    const cartId = user.cart[0];

    // Verificar si el ID del carrito es válido
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: "ID de carrito inválido." });
    }

    // Eliminar el carrito por su ID
    await cartService.delete(cartId);

    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Carrito eliminado con éxito.`
    );
    res.json("Carrito eliminado con éxito");
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Error al eliminar el carrito:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const finalizePurchase = async (req, res) => {
  try {
    const token = req.cookies.token;
    const userId = getUserIdFromToken(token);

    const user = await userService.findById(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 404;
      throw error;
    }

    const cartId = user.cart[0];

    // Obtener el carrito correspondiente al usuario
    const cart = await cartService.findById(cartId);
    if (!cart) {
      const error = new Error("Carrito no encontrado.");
      error.status = 404;
      throw error;
    }

    const productsFailed = [];
    const productsWithDetails = [];

    // Obtener los detalles completos de los productos en el carrito
    for (const item of cart.products) {
      const product = await productService.findById(item._id);
      if (!product) {
        const error = new Error("Producto no encontrado.");
        error.status = 404;
        throw error;
      }

      // Verificar si hay suficiente stock disponible
      if (product.stock < item.quantity) {
        productsFailed.push(item._id);
      } else {
        productsWithDetails.push({
          price: product.price,
          stock: product.stock,
          quantity: item.quantity,
        });
      }
    }

    // Calcular el total de la compra con los detalles completos de los productos
    const totalAmount = calculateTotalAmount(productsWithDetails);

    if (productsFailed.length === 0) {
      // Crear un ticket de compra y realizar la compra con éxito
      const ticket = await ticketService.save({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: user.email,
        products: cart,
      });

      // Eliminar el carrito después de completar la compra
      // Actualizar el carrito para que esté vacío
      const updatedCart = await cartService.update(cartId, { products: [] });

      // Verificar si se pudo actualizar correctamente el carrito
      if (!updatedCart) {
        const error = new Error("Error al actualizar el carrito a vacío");
        error.status = 500;
        throw error;
      }

      await sendPurchaseSuccessEmail(user.email, ticket);

      req.logger.info(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Compra realizada con éxito.`
      );

      return ticket;
    } else {
      // Actualizar el carrito para contener solo los productos que no se pudieron comprar
      cart.products = cart.products.filter((item) =>
        productsFailed.includes(item.product)
      );

      // Eliminar el carrito existente
      const deletedCart = await cartService.delete(cartId);

      // Verificar si se pudo eliminar correctamente el carrito
      if (!deletedCart) {
        const error = new Error("Error al eliminar el carrito existente");
        error.status = 500;
        throw error;
      }

      // Crear un nuevo carrito vacío asociado al usuario
      const newCart = await cartService.createEmptyCart(userId);

      // Verificar si se pudo crear correctamente el nuevo carrito
      if (!newCart) {
        const error = new Error("Error al crear un nuevo carrito");
        error.status = 500;
        throw error;
      }

      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Algunos productos no están disponibles.`
      );

      if (productsFailed.length > 0) {
        const error = new Error("Algunos productos no están disponibles.");
        error.status = 404;
        error.productsFailed = productsFailed;
        throw error;
      }
    }
  } catch (error) {
    // Registra el error
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al realizar la compra:`,
      error
    );

    // Captura el error y lo pasa al controlador que lo invocó
    throw error;
  }
};
