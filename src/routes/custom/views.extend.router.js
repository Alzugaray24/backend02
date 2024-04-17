import CustomRouter from "./custom.router.js";

export default class ViewsExtendRouter extends CustomRouter {
  init() {
    this.get("/", ["PUBLIC"], (req, res) => {
      const cssFileName = "index.css";
      const jsFileName = "index.js";
      res.render("index", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
    });

    this.get("/register", ["PUBLIC"], (req, res) => {
      const cssFileName = "register.css";
      const jsFileName = "register.js";
      res.render("register", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
    });

    this.get("/login", ["PUBLIC"], (req, res) => {
      const cssFileName = "login.css";
      const jsFileName = "login.js";
      res.render("login", {
        cssFileName: cssFileName,
        jsFileName: jsFileName,
      });
    });
  }
}
