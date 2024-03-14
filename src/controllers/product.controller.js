import { productService } from "../services/service.js";

export const getProductController = async (req, res) => {
  try {
    const productos = await productService.getAll();
    req.logger.info("Productos obtenidos con éxito:", productos);
    res.json(productos);
  } catch (error) {
    req.logger.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postProductController = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const producto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    await productService.save(producto);
    req.logger.info("Producto creado con éxito");
    res.json("Producto creado con éxito");
  } catch (error) {
    req.logger.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const nuevoProd = req.body;

    await productService.update(id, nuevoProd);

    req.logger.info("Producto actualizado con éxito");
    res.json("Producto actualizado con éxito");
  } catch (error) {
    req.logger.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del producto a eliminar

    // Lógica para eliminar el producto utilizando el servicio de productos
    await productService.delete(id);

    // Respuesta exitosa en formato JSON
    req.logger.info("Producto eliminado exitosamente");
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    // Manejo de errores: si hay algún error, devolver un código de estado 500 y un mensaje de error
    req.logger.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
