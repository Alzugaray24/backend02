import CartServiceMongo from "../dao/mongo/cart.service.js";

const cartService = new CartServiceMongo();

export default class CartDTO {
  constructor(cart) {
    this.userId = cart.userId;
    this.products = cart.products || [];
  }

  static async validateForCreate(cartData) {
    const errors = [];

    // Aquí puedes realizar validaciones específicas para la creación del carrito si es necesario

    return errors;
  }
}
