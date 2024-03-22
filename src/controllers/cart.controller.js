import { cartService } from "../services/service.js";
import { productService } from "../services/service.js";
import { ticketService } from "../services/service.js";
import { generateTicketCode, calculateTotalAmount } from "../dirname.js";

export const getCartController = async (req, res) => {
  try {
    const carts = await cartService.getAll();
    if (!carts || carts.length === 0) {
      req.logger.warn(`[${new Date().toLocaleString()}] [GET] ${req.originalUrl} - No se encontraron carritos.`);
      return res.status(404).json({ error: "No se encontraron carritos." });
    }
    res.json(carts);
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [GET] ${req.originalUrl} - Error al obtener los carritos:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Obtener el carrito del usuario o crear uno nuevo si no existe
    let cart = await cartService.getAll({ user: userId });
    if (cart.items.length === 0) {
      // Si el usuario no tiene un carrito, crear uno nuevo y asignarle el ID del usuario
      cart = await cartService.save({ user: userId, products: [] });
    } else {
      cart = cart.items[0]; // Tomamos el primer carrito encontrado (asumiendo que cada usuario solo tiene uno)
    }

    // Buscar el producto por su ID
    const product = await productService.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo con toda su información
      cart.products.push({ product: product, quantity });
    }

    // Guardar el carrito actualizado
    await cartService.update({ _id: cart._id }, cart);

    res.status(201).json({ message: "Producto agregado al carrito exitosamente.", cart: cart });
    req.logger.info(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Producto agregado al carrito exitosamente.`);
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Error al agregar producto al carrito:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, quantity } = req.body;
    if (!product || !quantity) {
      req.logger.error(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - El ID del producto y la cantidad son obligatorios.`);
      return res
        .status(400)
        .json({ error: "El ID del producto y la cantidad son obligatorios." });
    }
    await cartService.update(id, { product, quantity });
    req.logger.info(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Carrito actualizado con éxito.`);
    res.json("Carrito actualizado con éxito");
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Error al actualizar el carrito:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.delete(id);
    req.logger.info(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Carrito eliminado con éxito.`);
    res.json("Carrito eliminado con éxito");
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Error al eliminar el carrito:`, error);
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
      req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Carrito no encontrado.`);
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    // Obtener los detalles completos de los productos en el carrito
    const productsWithDetails = [];
    for (const item of cart.products) {
      const product = await productService.findById(item.product);
      if (!product) {
        req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Producto no encontrado.`);
        return res.status(404).json({ error: "Producto no encontrado." });
      }

      // Verificar si hay suficiente stock disponible
      if (product.stock < item.quantity) {
        productsFailed.push(item.product); // Agregar el ID del producto que no se pudo comprar
      } else {
        productsWithDetails.push({
          price: product.price,
          stock: product.stock,
          quantity: item.quantity
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
        products: cart.products
      });
      
      // Eliminar el carrito después de completar la compra
      await cartService.delete(cartId);

      res.status(200).json({ message: "Compra realizada con éxito.", ticket: ticket });
      req.logger.info(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Compra realizada con éxito.`);
    } else {
      // Actualizar el carrito para contener solo los productos que no se pudieron comprar
      cart.products = cart.products.filter(item => productsFailed.includes(item.product));
      await cartService.update(cartId, cart);

      res.status(400).json({ error: "Algunos productos no están disponibles.", productsFailed });
      req.logger.warn(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Algunos productos no están disponibles.`);
    }
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Error al realizar la compra:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

