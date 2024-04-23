import { userModel } from "./models/users.js";
import { isValidPassword } from "../../../dirname.js";

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

  findByEmail = async (email) => {
    try {
      // Buscar un usuario con el correo electrónico proporcionado
      const user = await userModel.findOne({ email: email });

      // Devolver el usuario encontrado (o null si no se encuentra)
      return user;
    } catch (error) {
      // Manejar cualquier error que ocurra durante la búsqueda
      throw new Error("Error al buscar el usuario por correo electrónico.");
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

  // En el servicio de usuario (userService)
  update = async (userId, updateData) => {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true, // Devuelve el documento actualizado
        }
      );
      return updatedUser;
    } catch (error) {
      console.error("Error in user update:", error);
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

  deleteInactiveUsers = async (cutoffDate) => {
    try {
      // Encuentra y elimina los usuarios que no se han conectado desde la fecha de corte
      const result = await userModel.deleteMany({
        lastLogin: { $lt: cutoffDate },
      });

      console.log(result);
      console.log("Aca");
      console.log(result.deletedCount);
      return result.deletedCount; // Retorna la cantidad de usuarios eliminados
    } catch (error) {
      // Manejo de errores
      console.error("Error al eliminar usuarios inactivos:", error);
      throw error;
    }
  };

  getInactiveUsersEmails = async (cutoffDate) => {
    try {
      console.log("entrando a getinactive");
      // Busca usuarios que no se han conectado desde la fecha de corte
      const inactiveUsers = await userModel.find({
        lastLogin: { $lt: cutoffDate },
      });

      console.log("inactiveusers: ");
      console.log(inactiveUsers);

      // Extrae los correos electrónicos de los usuarios inactivos
      const inactiveUsersEmails = inactiveUsers.map((user) => user.email);

      console.log("inactiveusersemails");
      console.log(inactiveUsersEmails);

      return inactiveUsersEmails;
    } catch (error) {
      // Maneja cualquier error ocurrido durante la búsqueda
      console.error(
        "Error al obtener los correos electrónicos de usuarios inactivos:",
        error
      );
      throw error;
    }
  };
}
