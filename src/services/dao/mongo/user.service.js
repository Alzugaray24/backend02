import { userModel } from "./models/users.js";
import { isValidPassword } from "../../../dirname.js";

export default class UserServiceMongo {
  constructor() {}

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
      throw error;
    }
  };

  findByEmail = async (email) => {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (error) {
      throw new Error("Error al buscar el usuario por correo electrónico.");
    }
  };

  save = async (user) => {
    try {
      const result = await userModel.create(user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  findById = async (id) => {
    try {
      const result = await userModel.findById(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  update = async (userId, updateData) => {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
        }
      );
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const result = await userModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      throw error;
    }
  };

  loginUser = async (email, password) => {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return null;
      }

      const isValid = isValidPassword(user, password);
      if (!isValid) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  deleteInactiveUsers = async (cutoffDate) => {
    try {
      const result = await userModel.deleteMany({
        lastLogin: { $lt: cutoffDate },
      });
      return result.deletedCount;
    } catch (error) {
      throw error;
    }
  };

  getInactiveUsersEmails = async (cutoffDate) => {
    try {
      const inactiveUsers = await userModel.find({
        lastLogin: { $lt: cutoffDate },
      });

      const inactiveUsersEmails = inactiveUsers.map((user) => user.email);

      return inactiveUsersEmails;
    } catch (error) {
      throw error;
    }
  };
}
