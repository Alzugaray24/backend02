import ProductServiceDao from "./dao/mongo/product.service.js";
import ProductRepository from "./repository/products.repository.js";
import CartServiceDao from "./dao/mongo/cart.service.js"
import CartRepository from "./repository/carts.repository.js"
import UserServiceDao from "./dao/mongo/user.service.js"
import UserRepository from "./repository/users.repository.js";


// Generamos las instancias de las clases

const productDao = new ProductServiceDao();
const cartDao = new CartServiceDao();
const userDao = new UserServiceDao();

export const productService = new ProductRepository(productDao);
export const cartService = new CartRepository(cartDao);
export const userService = new UserRepository(userDao);

