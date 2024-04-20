import CustomRouter from "./custom.router.js";
import {
  getAllUsersController,
  deleteUserController,
  loginController,
  registerUserController,
  profileController,
  logoutController,
  deleteUserInactiveController,
  changeRoleUserController,
} from "../../controllers/user.controller.js";

export default class UsersExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["ADMIN"], getAllUsersController);
    this.post("/:userId/change/:newRole", ["ADMIN"], changeRoleUserController);
    this.delete("/delete/:id", ["ADMIN"], deleteUserController);
    this.delete("/", ["ADMIN"], deleteUserInactiveController);
    this.post("/login", ["PUBLIC"], loginController);
    this.post("/register", ["PUBLIC"], registerUserController);
    this.get("/profile", ["USER", "USER_PREMIUM", "ADMIN"], profileController);
    this.post("/logout", ["USER", "USER_PREMIUM", "ADMIN"], logoutController);
  }
}
