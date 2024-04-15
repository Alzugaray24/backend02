import { cartService } from "../services/service.js";
import { productService } from "../services/service.js";
import { ticketService } from "../services/service.js";
import { generateTicketCode, calculateTotalAmount } from "../dirname.js";
import { userService } from "../services/service.js";
import CartDTO from "../services/dto/cart.dto.js";

export const getCartController = async (req, res) => {
  try {
    const userId = req.user._id; // Obtener el ID del usuario actual

    // Llamar a la función getAll del servicio de carritos con el filtro configurado para obtener solo los carritos de este usuario
    const carts = await cartService.getAll({ user: userId });

    if (!carts || carts.length === 0) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [GET] ${
          req.originalUrl
        } - No se encontraron carritos para el usuario con ID: ${userId}.`
      );
      return res.status(404).json({ error: "No se encontraron carritos." });
    }

    res.json(carts);
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los carritos:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Buscar al usuario por su ID
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    console.log(user);

    const cartId = user.cart[0]; // Obtener el ID del carrito del array
    let cart = await cartService.findById(cartId); // Buscar el carrito por su ID

    console.log(cart);

    if (!cart.products) {
      cart.products = [];
    }

    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualizar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({ product: productId, quantity });
    }

    // Guardar los cambios en el carrito
    await cartService.update(cart._id, cart);

    // Actualizar el usuario con el carrito modificado
    await userService.update(userId, { cart: user.cart });

    return res.status(201).json({
      message: "Producto agregado al carrito exitosamente.",
      carts: cart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantity } = req.body;

    // Validar los datos del carrito utilizando el DTO
    const validationErrors = await CartDTO.validateForUpdate({
      id,
      product,
      quantity,
    });

    console.log(validationErrors);

    if (validationErrors.length > 0) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [PUT] ${
          req.originalUrl
        } - Error de validación al actualizar el carrito: ${validationErrors.join(
          ", "
        )}.`
      );
      return res.status(400).json({ errors: validationErrors });
    }

    // Realizar la actualización del carrito
    await cartService.update({ _id: id }, { product, quantity });

    req.logger.info(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Carrito actualizado con éxito.`
    );
    res.json("Carrito actualizado con éxito");
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
    const { id } = req.params;
    await cartService.delete(id);
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
    const cartId = req.params.cartId;
    const productsFailed = []; // Almacenar los IDs de los productos que no se pudieron comprar

    // Obtener el carrito correspondiente al ID proporcionado
    const cart = await cartService.findById(cartId);
    if (!cart) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Carrito no encontrado.`
      );
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Obtener los detalles completos de los productos en el carrito
    const productsWithDetails = [];
    for (const item of cart.products) {
      const product = await productService.findById(item.product);
      if (!product) {
        req.logger.error(
          `[${new Date().toLocaleString()}] [POST] ${
            req.originalUrl
          } - Producto no encontrado.`
        );
        return res.status(404).json({ error: "Producto no encontrado." });
      }

      // Verificar si hay suficiente stock disponible
      if (product.stock < item.quantity) {
        productsFailed.push(item.product); // Agregar el ID del producto que no se pudo comprar
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

    // Crear un ticket de compra solo si se pudieron comprar todos los productos
    if (productsFailed.length === 0) {
      const ticket = await ticketService.save({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
        products: cart.products,
      });

      // Eliminar el carrito después de completar la compra
      await cartService.delete(cartId);

      res
        .status(200)
        .json({ message: "Compra realizada con éxito.", ticket: ticket });
      req.logger.info(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Compra realizada con éxito.`
      );
    } else {
      // Actualizar el carrito para contener solo los productos que no se pudieron comprar
      cart.products = cart.products.filter((item) =>
        productsFailed.includes(item.product)
      );
      await cartService.update(cartId, cart);

      res.status(400).json({
        error: "Algunos productos no están disponibles.",
        productsFailed,
      });
      req.logger.warn(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Algunos productos no están disponibles.`
      );
    }
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al realizar la compra:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
