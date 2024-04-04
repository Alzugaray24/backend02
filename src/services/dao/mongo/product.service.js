import { productModel } from "./models/product.js";

export default class ProductServiceMongo {
  constructor() {
    console.log("Working with Products using Database persistence in MongoDB");
  }

  getAll = async (options) => {
    try {
      // Desestructuramos las propiedades del objeto options
      const { limit = 10, page = 1, category, availability, sort, query } = options || {};

      // Construimos el filtro en base a las propiedades proporcionadas
      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (availability !== undefined) {
        filter.availability = availability;
      }
      if (query) {
        filter.title = { $regex: query, $options: "i" };
      }

      // Realizamos la consulta a la base de datos
      const result = await productModel
        .find(filter)
        .sort({ price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      // Contamos el total de elementos que coinciden con el filtro
      const totalItems = await productModel.countDocuments(filter);

      // Retornamos los resultados
      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  };

  save = async (product) => {
    let result = await productModel.create(product);
    return result;
  };

  findById = async (id) => {
    const result = await productModel.findById(id);
    return result;
};


update = async (filter, value) => {
  try {
    // Verificar si el filtro es un ObjectId y, si es así, convertirlo a un objeto filtro
    if (typeof filter === 'string') {
      filter = { _id: filter };
    }

    // Realizar la actualización en la base de datos y obtener el documento actualizado
    const updatedDocument = await productModel.findOneAndUpdate(filter, value, { new: true });

    // Verificar si se encontró y se actualizó correctamente el documento
    if (!updatedDocument) {
      throw new Error("Documento no encontrado para actualizar.");
    }

    // Retornar el documento actualizado
    return updatedDocument;
  } catch (error) {
    console.error("Error en update:", error);
    throw error;
  }
};


  delete = async (id) => {
    const result = await productModel.deleteOne({ id: id });
    return result;
  };
}
