import { productService } from "../services/service.js";

export const getProductController = async (req, res) => {
  try {
    const products = await productService.getAll();
    req.logger.info(`[${new Date().toLocaleString()}] [GET] ${req.originalUrl} - Productos obtenidos con éxito:`, products);
    res.json(products);
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [GET] ${req.originalUrl} - Error al obtener los productos:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postProductController = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    await productService.save(product);
    req.logger.info(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Producto creado con éxito`);
    res.json("Producto creado con éxito");
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Error al crear el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const newProduct = req.body;

    await productService.update(id, newProduct);

    req.logger.info(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Producto actualizado con éxito`);
    res.json("Producto actualizado con éxito");
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Error al actualizar el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    await productService.delete(id);

    req.logger.info(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Producto eliminado exitosamente`);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Error al eliminar el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
