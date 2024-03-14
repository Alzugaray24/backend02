import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

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
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "60s" });
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

  console.log("Hola mudno");
  console.log(authHeader);
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

export default __dirname;
