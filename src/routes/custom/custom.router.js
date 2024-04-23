import { Router } from "express";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "../../dirname.js";
import errorHandler from "../../services/middlewares/errorHandler.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }
  init() {
    this.router.use(errorHandler);
  } //Esta inicialilzacion se usa para las clases heredadas.

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  // POST
  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  // PUT
  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  // DELETE
  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }

  handlePolicies = (policies) => (req, res, next) => {
    // Validar si tiene acceso público:
    if (policies[0] === "PUBLIC") return next();

    // Obtener el token de la cookie
    const token = req.cookies.token;

    // const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .send({ error: "User not authenticated or missing token." });
    }

    // Validar el token
    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
      if (error)
        return res.status(403).send({ error: "Token invalid, Unauthorized!" });

      // Token válido
      const user = credential.user;

      // Verificar si el rol del usuario tiene acceso según las políticas
      if (!policies.includes(user.role.toUpperCase()))
        return res.status(403).send({
          error: "El usuario no tiene privilegios, revisa tus roles!",
        });

      // Si el rol del usuario tiene acceso, continuar
      req.user = user;

      next();
    });
  };

  generateCustomResponses = (req, res, next) => {
    //Custom responses
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "Success", payload });
    res.sendInternalServerError = (error) =>
      res.status(500).send({ status: "Error", error });
    res.sendClientError = (error) =>
      res
        .status(400)
        .send({ status: "Client Error, Bad request from client.", error });
    res.sendUnauthorizedError = (error) =>
      res
        .status(401)
        .send({ error: "User not authenticated or missing token." });
    res.sendForbiddenError = (error) =>
      res.status(403).send({
        error:
          "Token invalid or user with no access, Unauthorized please check your roles!",
      });
    next();
  };

  // función que procese todas las funciones internas del router (middlewares y el callback principal)
  // Se explica en el slice 28
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...item) => {
      try {
        await callback.apply(this, item);
      } catch (error) {
        console.error(error);
        // params[1] hace referencia al res
        item[1].status(500).send(error);
      }
    });
  }
}
