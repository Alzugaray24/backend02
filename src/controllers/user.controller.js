import { userService } from "../services/service.js";
import { generateJWToken } from "../dirname.js";
import { createHash, isValidPassword } from "../dirname.js";

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al obtener los usuarios: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const registerUserController = async (req, res) => {
  try {
    const userData = req.body;

    const hashedPassword = createHash(userData.password);
    userData.password = hashedPassword;

    const newUser = await userService.save(userData);
    req.logger.info(`${req.method} en ${req.url} - Usuario registrado con éxito: ${newUser} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(201).json({
      status: "Usuario creado con éxito",
      usuario: newUser,
    });
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al registrar al usuario: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    await userService.update(id, newData);
    req.logger.info(`${req.method} en ${req.url} - Usuario actualizado con éxito - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.json("Usuario actualizado con éxito");
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al actualizar el usuario: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.delete(id);
    req.logger.info(`${req.method} en ${req.url} - Usuario eliminado con éxito - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.json("Usuario eliminado con éxito");
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al eliminar el usuario: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
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
    req.logger.info(`${req.method} en ${req.url} - Sesión iniciada - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    return res.status(200).json({
      status: "Sesión iniciada",
      token: token,
    });
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al iniciar sesión: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwtCookieToken");
    req.logger.info(`${req.method} en ${req.url} - Sesión cerrada con éxito - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.json({
      status: "Sesión cerrada con éxito",
    });
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al cerrar sesión: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const profileController = async (req, res) => {
  try {
    req.logger.info(`${req.method} en ${req.url} - Obteniendo perfil del usuario - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    const user = req.user;

    req.logger.info(`${req.method} en ${req.url} - Perfil del usuario: ${user} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    return res.json({ user });
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error al obtener el perfil del usuario: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
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
    req.logger.info(`${req.method} en ${req.url} - Token generado: ${access_token} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
      httpOnly: true,
    });
  } catch (error) {
    req.logger.error(`${req.method} en ${req.url} - Error en la autenticación de GitHub: ${error} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
