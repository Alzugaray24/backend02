import { cartModel } from "./models/carts.js";

export default class CartServiceMongo {
  constructor() {
    console.log("Working with Carts using Database persistence in MongoDB");
  }

  getAll = async (options) => {
    try {
      const { limit = 10, page = 1, user } = options || {};

      const filter = {};
      if (user) {
        filter.user = user;
      }

      const result = await cartModel
        .find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalItems = await cartModel.countDocuments(filter);

      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  };

  save = async (cart) => {
    let result = await cartModel.create(cart);
    return result;
  };

  findById = async (id) => {
    const result = await cartModel.findOne({ id: id });
    return result;
  };

  update = async (filter, value) => {
    console.log("Update cart with filter and value:");
    console.log(filter);
    console.log(value);
    let result = await cartModel.updateOne(filter, value);
    return result;
  };

  delete = async (id) => {
    console.log(id);
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };
}
