import CartDao from "../daos/cart.dao.js";
import { productModel } from "../models/products.model.js";

const cartDao = new CartDao();

export const obtenerCarts = async () => {
    try {
        const carts = await cartDao.getAllCarts();
        return carts;
    } catch (error) {
        console.error("Error al obtener todos los carritos:", error);
        throw error;
    }
};

export const createCart = async (cartData) => {
    try {
        // Verificar si los datos del carrito están completos
        if (!cartData.product || !cartData.quantity) {
            throw new Error("Los datos del carrito están incompletos.");
        }

        // Verificar si la cantidad del producto es válida
        if (cartData.quantity <= 0) {
            throw new Error("La cantidad del producto debe ser mayor que cero.");
        }

        // Verificar si el ID del producto existe en la base de datos
        const existingProduct = await productModel.findById(cartData.product);
        if (!existingProduct) {
            throw new Error("El ID del producto proporcionado no existe.");
        }

        // Crear el carrito utilizando el DAO
        const cart = await cartDao.createCart(cartData);
        return cart;
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        throw error;
    }
};

export const actualizarCarrito = async (id, nuevoProducto) => {
    try {
        // Verificar si el carrito existe
        const cartExistente = await cartDao.getCartById(id);
        if (!cartExistente) {
            throw new Error("El carrito no existe");
        }

        // Verificar si el ID del producto existe en la base de datos
        const existingProduct = await productModel.findById(nuevoProducto.product);
        if (!existingProduct) {
            throw new Error("El ID del producto proporcionado no existe.");
        }

        // Crear un objeto con los campos necesarios para actualizar el carrito
        const cartUpdate = {
            productos: [{ product: nuevoProducto.product, quantity: nuevoProducto.quantity }]
        };

        // Actualizar el carrito utilizando el DAO
        const updatedCart = await cartDao.updateCart(id, cartUpdate);
        return updatedCart;
    } catch (error) {
        console.error("Error al actualizar el carrito desde el service", error);
        throw error;
    }
};


export const eliminarCarrito = async (id) => {
    try {
        // Verificar si el carrito existe
        const cartExistente = await cartDao.getCartById(id);
        if (!cartExistente) {
            throw new Error("El carrito no existe");
        }

        // Eliminar el carrito utilizando el DAO
        await cartDao.deleteCart(id);
    } catch (error) {
        console.error("Error al eliminar el carrito:", error);
        throw error;
    }
};
