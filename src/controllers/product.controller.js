import { productService } from "../services/service.js";
import ProductDTO from "../services/dto/product.dto.js";

export const getProductController = async (req, res) => {
  try {
    const validationErrors = ProductDTO.validateForRead();

    if (validationErrors.length > 0) {
      console.log("Errores de validación:", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    const products = await productService.getAll();
    req.logger.info(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Productos obtenidos con éxito:`,
      products
    );

    return products;
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los productos:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const postProductController = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const productData = { title, description, price, thumbnail, code, stock };
    const validationErrors = await ProductDTO.validateForCreate(productData);

    if (validationErrors.length > 0) {
      console.log("Errores de validación:", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    const result = await productService.save(productData);
    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Producto creado con éxito`
    );
    res.status(201).json({ status: "success", payload: result });
  } catch (error) {
    console.log("Error al crear el producto:", error);
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al crear el producto:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const putProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const newProduct = req.body;

    // Validar el nuevo producto utilizando el DTO
    const validationErrors = ProductDTO.validateForUpdate(newProduct);
    if (validationErrors.length > 0) {
      console.log("Errores de validación:", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    // Actualizar el producto en la base de datos
    const updatedProduct = await productService.update(id, newProduct);

    // Verificar si el producto se actualizó correctamente
    if (!updatedProduct) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [PUT] ${
          req.originalUrl
        } - Producto no encontrado para actualizar`
      );
      return res
        .status(404)
        .json({ error: "Producto no encontrado para actualizar" });
    }

    console.log("hola pedro");

    req.logger.info(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Producto actualizado con éxito`
    );
    res.status(200).json({ status: "success", updatedProduct }); // Enviar la respuesta con el producto actualizado
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    req.logger.error(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Error al actualizar el producto:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const validationErrors = ProductDTO.validateForDelete(id);

    if (validationErrors.length > 0) {
      console.log("Errores de validación:", validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }

    const deletedProduct = await productService.delete(id);

    if (deletedProduct.deletedCount === 0) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [DELETE] ${
          req.originalUrl
        } - Producto no encontrado para eliminar`
      );
      return res
        .status(404)
        .json({ error: "Producto no encontrado para eliminar" });
    }

    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Producto eliminado exitosamente`
    );
    res
      .status(200)
      .json({ status: "success", deleted: `Producto eliminado exitosamente` });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Error al eliminar el producto:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
