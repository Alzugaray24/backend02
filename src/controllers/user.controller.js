import { userService } from "../services/service.js";
import { generateJWToken } from "../dirname.js";
import { createHash, isValidPassword } from "../dirname.js";
import UsersDTO from "../services/dto/users.dto.js";
import { cartService } from "../services/service.js";
import moment from "moment";
import { sendDeleteAccountEmail } from "../dirname.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAll();

    if (!users || !users.items || users.items.length === 0) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [GET] ${
          req.originalUrl
        } - No se encontraron usuarios.`
      );
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }

    const infoUsers = UsersDTO.infoUser(users.items);

    req.logger.info(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Usuarios obtenidos con éxito:`,
      infoUsers
    );

    return infoUsers;
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los usuarios:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Todos los campos son obligatorios.`
      );
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios." });
    }

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - El correo electrónico ya está en uso.`
      );
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está en uso." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Formato de correo electrónico inválido.`
      );
      return res
        .status(400)
        .json({ error: "Formato de correo electrónico inválido." });
    }

    if (isNaN(age) || age < 1 || age > 150) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - La edad debe ser un número válido.`
      );
      return res
        .status(400)
        .json({ error: "La edad debe ser un número válido." });
    }

    const hashedPassword = createHash(password);

    const newUser = await userService.save({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    const newCart = await cartService.createEmptyCart(newUser._id);

    newUser.cart.push(newCart._id);

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
    return res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Error al actualizar el usuario:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [DELETE] ${
          req.originalUrl
        } - Usuario no encontrado.`
      );
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    await userService.delete(id);
    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Usuario eliminado con éxito`
    );

    return res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Error al eliminar el usuario:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } - Todos los campos deben ser obligatorios`
      );
      return res
        .status(400)
        .json({ error: "Se requieren correo electrónico y contraseña." });
    }

    const user = await userService.loginUser(email, password);

    if (user === null || !isValidPassword(user, password)) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [DELETE] ${
          req.originalUrl
        } Correo electrónico o contraseña incorrectos.`
      );
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
    return res.status(500).json({ error: "Error interno del servidor." });
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
    return res.json({
      status: "Sesión cerrada con éxito",
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } - Error al cerrar sesión:`,
      error
    );
    return res.status(500).json({ error: "Error interno del servidor." });
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
    res.status(200).send({ token: access_token });
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
    const cutoffDate = moment().subtract(2, "days").toDate();

    const deletedUsersEmails = await userService.getInactiveUsersEmails(
      cutoffDate
    );

    for (const email of deletedUsersEmails) {
      await sendDeleteAccountEmail(email);
    }

    const deletedUsers = await userService.deleteInactiveUsers(cutoffDate);

    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } Usuarios inactivos por 2 dias fueron eliminados con exito`
    );

    res.status(200).json({ msg: deletedUsers });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Error al eliminar usuarios inactivos:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const changeRoleUserController = async (req, res) => {
  try {
    const { userId, newRole } = req.params;

    const user = await userService.findById(userId);
    if (!user) {
      req.logger.error(
        `[${new Date().toLocaleString()}] [POST] ${
          req.originalUrl
        } usuario no encontrado`
      );
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    user.role = newRole;

    await userService.update(userId, user);

    req.logger.info(
      `[${new Date().toLocaleString()}] [POST] ${
        req.originalUrl
      } rol cambiado con exito`
    );

    res.status(200).send({
      msg: "Rol cambiado con éxito",
      newUserRole: user,
    });
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [PUT] ${
        req.originalUrl
      } - Error al cambiar el rol del usuario:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
