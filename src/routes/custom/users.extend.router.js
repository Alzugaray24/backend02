import CustomRouter from "./custom.router.js";
import {
  loginController,
  registerUserController,
  profileController,
  logoutController,
  githubCallbackController,
} from "../../controllers/user.controller.js";
import passport from "passport";

export default class UsersExtendRouter extends CustomRouter {
  init() {

    // Define tus rutas y middlewares
    this.router.get(
      "/github",
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );

    this.router.get(
      "/githubcallback",
      passport.authenticate("github", {
        session: false,
        failureRedirect: "/github/error",
      }),
      githubCallbackController
    );

    this.get("/currentUser", ["USER", "USER_PREMIUM"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.get("/premiumUser", ["USER_PREMIUM"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.get("/adminUser", ["ADMIN"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.post("/login", ["PUBLIC"], loginController);

    this.post("/register", ["PUBLIC"], registerUserController);

    this.get("/profile", ["USER", "USER_PREMIUM"], profileController);

    this.post("/logout", ["USER", "USER_PREMIUM", "ADMIN"], logoutController);
  }
}
