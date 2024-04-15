import { userService } from "../services/service.js";
import { generateJWToken } from "../dirname.js";
import { createHash, isValidPassword } from "../dirname.js";
import UsersDTO from "../services/dto/users.dto.js";
import EErrors from "../services/errors-enum.js";
import { generateUserErrorInfo } from "../services/messages/user-creation-error.message.js";
import CustomError from "../services/CustomError.js";
import { cartService } from "../services/service.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAll();
    req.logger.info(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Usuarios obtenidos con éxito:`,
      users
    );
    res.json(users);
  } catch (error) {
    req.logger.error(
      `[${new Date().toLocaleString()}] [GET] ${
        req.originalUrl
      } - Error al obtener los usuarios:`,
      error
    );
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const registerUserController = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  // Verificar que los campos requeridos no estén vacíos
  if (!first_name || !last_name || !email || !age || !password) {
    throw CustomError.createError({
      name: "User Create Error",
      cause: generateUserErrorInfo({ first_name, last_name, age, email }),
      message: "Error tratando de crear al usuario",
      code: EErrors.INVALID_TYPES_ERROR,
    });
  }

  // Verificar si el email es válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    req.logger.error(
      "[POST] /api/extend/users/register - Formato de correo electrónico inválido."
    );
    return res
      .status(400)
      .json({ error: "Formato de correo electrónico inválido." });
  }

  // Verificar si la edad es un número válido
  if (isNaN(age) || age < 0 || age > 150) {
    req.logger.error("[POST] /api/extend/users/register - Edad inválida.");
    return res
      .status(400)
      .json({ error: "La edad debe ser un número válido." });
  }

  // Hash de la contraseña
  const hashedPassword = createHash(password);

  // Guardar el usuario y crear un carrito vacío asociado
  try {
    const newUser = await userService.save({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    // Agregar console.log para verificar el nuevo usuario
    console.log("Nuevo usuario registrado:", newUser);

    const newCart = await cartService.createEmptyCart(newUser._id);

    // Agregar console.log para verificar el nuevo carrito
    console.log("Nuevo carrito creado:", newCart);

    // Verificar el tipo y contenido del campo `cart` en el nuevo usuario
    console.log("Tipo de 'cart' en el nuevo usuario:", typeof newUser.cart);
    console.log("Contenido de 'cart' en el nuevo usuario:", newUser.cart);

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
    // Si ocurre algún error durante la ejecución de userService.save()
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
    await userService.delete(id);
    req.logger.info(
      `[${new Date().toLocaleString()}] [DELETE] ${
        req.originalUrl
      } - Usuario eliminado con éxito`
    );
    res.json("Usuario eliminado con éxito");
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
