import { productService } from "../services/service.js";

export const getProductController = async (req, res) => {
  try {
    const products = await productService.getAll();
    req.logger.info(`[${new Date().toLocaleString()}] [GET] ${req.originalUrl} - Productos obtenidos con éxito:`, products);
    res.status(201).send({
      status: "success", 
      products: products
    });
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
    const result = await productService.save(product);
    req.logger.info(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Producto creado con éxito`);
    res.status(201).send({
      status: "success", 
      payload: result
    });
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [POST] ${req.originalUrl} - Error al crear el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const newProduct = req.body;

    const updatedProduct = await productService.update(id, newProduct);

    if (!updatedProduct) {
      req.logger.error(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Producto no encontrado para actualizar`);
      res.status(404).json({ error: "Producto no encontrado para actualizar" });
      return;
    }

    req.logger.info(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Producto actualizado con éxito`);
    res.status(201).send({
      status: "success",
      updated: updatedProduct
    });
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [PUT] ${req.originalUrl} - Error al actualizar el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor.", error });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.delete(id);

    if (!deletedProduct) {
      req.logger.error(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Producto no encontrado para eliminar`);
      res.status(404).json({ error: "Producto no encontrado para eliminar" });
      return;
    }

    req.logger.info(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Producto eliminado exitosamente`);
    res.status(201).send({ 
      status: "success", 
      deleted: `Producto ${deletedProduct} eliminado exitosamente`
     });
  } catch (error) {
    req.logger.error(`[${new Date().toLocaleString()}] [DELETE] ${req.originalUrl} - Error al eliminar el producto:`, error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
