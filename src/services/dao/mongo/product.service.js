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
    console.log("Update product with filter and value:");
    console.log(filter);
    console.log(value);
    let result = await productModel.updateOne(filter, value);
    return result;
  };

  delete = async (id) => {
    const result = await productModel.deleteOne({ id: id });
    return result;
  };
}
