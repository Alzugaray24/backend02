import CustomRouter from "./custom.router.js";
import {
  getAllUsersController,
  loginController,
  registerUserController,
  profileController,
  logoutController,
  deleteUserInactiveController,
} from "../../controllers/user.controller.js";

export default class UsersExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], getAllUsersController);
    this.delete("/", ["PUBLIC"], deleteUserInactiveController);
    this.post("/login", ["PUBLIC"], loginController);
    this.post("/register", ["PUBLIC"], registerUserController);
    this.get("/profile", ["PUBLIC"], profileController);
    this.post("/logout", ["PUBLIC"], logoutController);
  }
}
