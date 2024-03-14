import { userModel } from "./models/users.js"
import { isValidPassword } from "../../../dirname.js"

export default class UserServiceMongo {
  constructor() {
    console.log("Working with Users using Database persistence in MongoDB");
  }

  getAll = async (options) => {
    try {
      const { limit = 10, page = 1 } = options || {};

      const result = await userModel
        .find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalItems = await userModel.countDocuments({});

      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  };

  save = async (user) => {
    try {
      const result = await userModel.create(user);
      return result;
    } catch (error) {
      console.error("Error in save:", error);
      throw error;
    }
  };

  findById = async (id) => {
    try {
      const result = await userModel.findById(id);
      return result;
    } catch (error) {
      console.error("Error in findById:", error);
      throw error;
    }
  };

  update = async (filter, updates) => {
    try {
      const result = await userModel.updateOne(filter, updates);
      return result;
    } catch (error) {
      console.error("Error in update:", error);
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const result = await userModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      console.error("Error in delete:", error);
      throw error;
    }
  };

  loginUser = async (email, password) => {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        // El usuario no fue encontrado
        return null;
      }
  
      // Verificar la contraseña utilizando isValidPassword
      const isValid = isValidPassword(user, password);
      if (!isValid) {
        // La contraseña es incorrecta
        return null;
      }
  
      // Devolver el usuario si la autenticación fue exitosa
      return user;
    } catch (error) {
      console.error("Error in loginUser:", error);
      throw error;
    }
  };
  
}
