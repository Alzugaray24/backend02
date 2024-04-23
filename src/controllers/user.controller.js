import { userService } from "../services/service.js";
import { generateJWToken } from "../dirname.js";
import { createHash, isValidPassword } from "../dirname.js";
import UsersDTO from "../services/dto/users.dto.js";
import EErrors from "../services/errors-enum.js";
import { generateUserErrorInfo } from "../services/messages/user-creation-error.message.js";
import CustomError from "../services/CustomError.js";
import { cartService } from "../services/service.js";
import moment from "moment";
import {
  sendDeleteAccountEmail,
  sendPurchaseSuccessEmail,
} from "../dirname.js";

export const getAllUsersController = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await userService.getAll();

    // Verificar si se obtuvieron usuarios
    if (!users || !users.items || users.items.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }

    // Convertir la información de los usuarios
    const infoUsers = UsersDTO.infoUser(users.items);

    // Enviar la respuesta con los usuarios
    return infoUsers;
  } catch (error) {
    // Registrar el error
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los usuarios:`,
      error
    );
    // Enviar una respuesta de error
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar que los campos requeridos no estén vacíos
    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Verificar si el email ya está en uso
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new Error("El correo electrónico ya está en uso.");
    }

    // Verificar si el email es válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Formato de correo electrónico inválido.");
    }

    // Verificar si la edad es un número válido
    if (isNaN(age) || age < 0 || age > 150) {
      throw new Error("La edad debe ser un número válido.");
    }

    // Hash de la contraseña
    const hashedPassword = createHash(password);

    // Guardar el usuario y crear un carrito vacío asociado
    const newUser = await userService.save({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    const newCart = await cartService.createEmptyCart(newUser._id);

    // Asignar el ID del carrito al array de carritos del usuario
    newUser.cart.push(newCart._id);

    // Guardar el usuario actualizado
    await newUser.save();

    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Usuario registrado con éxito:`,
      newUser
    );

    return res.status(201).json({
      status: "Usuario creado con éxito",
      usuario: newUser,
    });
  } catch (error) {
    // Manejar el error
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al registrar al usuario:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    await userService.update(id, newData);
    req.logger.info(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Usuario actualizado con éxito`
    );
    res.json("Usuario actualizado con éxito");
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Error al actualizar el usuario:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 404;
      throw error;
    }

    await userService.delete(id);
    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Usuario eliminado con éxito`
    );

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Error al eliminar el usuario:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Se requieren correo electrónico y contraseña." });
    }

    const user = await userService.loginUser(email, password);

    if (user === null || !isValidPassword(user, password)) {
      return res
        .status(401)
        .json({ error: "Correo electrónico o contraseña incorrectos." });
    }

    user.lastLogin = new Date();
    await userService.update(user._id, { lastLogin: user.lastLogin });

    const token = generateJWToken(user);
    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Sesión iniciada`
    );
    return res.status(200).json({
      status: "Sesión iniciada",
      token: token,
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al iniciar sesión:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwtCookieToken");
    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Sesión cerrada con éxito`
    );
    res.json({
      status: "Sesión cerrada con éxito",
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al cerrar sesión:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const profileController = async (req, res) => {
  try {
    req.logger.info(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Obteniendo perfil del usuario`
    );
    const user = new UsersDTO(req.user);
    req.logger.info(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Perfil del usuario:`,
      user
    );

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    return res.json({ user });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener el perfil del usuario:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const githubCallbackController = async (req, res) => {
  try {
    const user = req.user;
    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };
    const access_token = generateJWToken(tokenUser);
    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Token generado:`,
      access_token
    );
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
      httpOnly: true,
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error en la autenticación de GitHub:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteUserInactiveController = async (req, res) => {
  try {
    // Calcula la fecha límite para la inactividad (hace 2 días)
    const cutoffDate = moment().subtract(30, "seconds").toDate();

    // Envía correos electrónicos a los usuarios cuyas cuentas han sido eliminadas
    const deletedUsersEmails = await userService.getInactiveUsersEmails(
      cutoffDate
    );

    for (const email of deletedUsersEmails) {
      await sendDeleteAccountEmail(email);
    }

    // Encuentra y elimina los usuarios inactivos
    const deletedUsers = await userService.deleteInactiveUsers(cutoffDate);

    res.status(200).json({ message: `${deletedUsers} usuarios eliminados.` });
  } catch (error) {
    console.error("Error al eliminar usuarios inactivos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const changeRoleUserController = async (req, res) => {
  try {
    const { userId, newRole } = req.params;

    const user = await userService.findById(userId);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 404;
      throw error;
    }

    user.role = newRole;

    console.log(user);

    await userService.update(userId, user);

    res.status(200).send({
      msg: "Rol cambiado con exito",
      newUserRole: user,
    });
  } catch (error) {
    throw error;
  }
};
