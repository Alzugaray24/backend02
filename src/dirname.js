import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Configurar multer para manejar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/img"); // Directorio donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usar el nombre original del archivo
  },
});

export const upload = multer({ storage: storage });

//Crypto functions
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

//JSON Web Tokens JWT functions:
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
/**
 * Generate token JWT using jwt.sign:
 * First argument: object to encrypt inside the JWT
 * Second argument: The private key to sign the token.
 * Third argument: Token expiration time.
 */
export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
};
/**
 * Method that authenticates the JWT token for our requests.
 * NOTE: This acts as a middleware, observe the next.
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Pass to the next event.
 */
export const authToken = (req, res, next) => {
  // The JWT token is saved in the authorization headers.
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1]; // Split to remove the Bearer word.

  // Validate token
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    // Token OK
    req.user = credentials.user;
    next();
  });
};

// For error handling
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

// For Auth management
export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");

    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: User does not have permissions with this role.");
    }
    next();
  };
};

// Función para generar un código de ticket único
export function generateTicketCode() {
  // Generar un código de ticket único utilizando un timestamp y algún valor aleatorio
  const timestamp = Date.now().toString(36); // Convertir el timestamp a una cadena de caracteres en base 36
  const randomValue = Math.random().toString(36).substr(2, 5); // Generar un valor aleatorio y tomar solo los primeros 5 caracteres
  return timestamp + randomValue; // Concatenar el timestamp y el valor aleatorio para obtener el código del ticket
}

// Función para calcular el total de la compra
export function calculateTotalAmount(products) {
  // Inicializar el total en 0
  let totalAmount = 0;

  // Iterar sobre cada producto y sumar el precio por la cantidad al total
  for (const item of products) {
    totalAmount += item.price * item.quantity; // Suponiendo que cada producto tenga un precio y una cantidad
  }

  return totalAmount;
}

export const sendDeleteAccountEmail = async (email) => {
  try {
    console.log("Enviando correo electrónico...");

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      // Configura los detalles del servicio SMTP o el servicio de correo electrónico que estés utilizando
      // Aquí se muestra un ejemplo con el servicio SMTP de Gmail
      service: "gmail",
      port: 587,
      auth: {
        user: "alzugaray1997@gmail.com",
        pass: "qrzdlkywmotrrmyv",
      },
    });

    // Contenido del correo electrónico
    const mailOptions = {
      from: "Coder test alzugaray1997@gmail.com",
      to: email,
      subject: "Notificación de eliminación de cuenta",
      text: "Tu cuenta ha sido eliminada. Si tienes alguna pregunta, ponte en contacto con el soporte.",
    };

    // Envía el correo electrónico
    console.log("Enviando correo electrónico a:", email);
    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado con éxito");
  } catch (error) {
    // Manejo de errores
    console.error("Error al enviar el correo electrónico:", error);
    throw error;
  }
};

export default __dirname;
