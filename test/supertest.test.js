import { expect } from "chai";
import supertest from "supertest";

const app = supertest("http://localhost:3000");

describe("Testeando mi aplicativo", () => {
  let productId;

  it("El endpoint GET /api/extend/products debe obtener todos los productos correctamente", async () => {
    const { statusCode, _body } = await app.get("/api/extend/products");

    console.log(_body.items);

    expect(statusCode).to.equal(201);
    expect(_body.status).to.equal("success");
    expect(_body.products).to.be.an("object");
    expect(_body.products.items).to.be.an("array");
    expect(_body.products.totalItems).to.be.a("number").to.equal(0);
  });

  it("El endpoint POST /api/extend/products debe de crear un producto correctamente", async () => {
    const productData = {
      title: "Producto Nuevo",
      description: "Descripción del producto nuevo",
      price: 100,
      thumbnail: "imagen.png",
      code: "ABC123",
      stock: 10,
    };

    const { statusCode, _body } = await app
      .post("/api/extend/products")
      .send(productData);

    expect(statusCode).to.equal(201);
    expect(_body.payload).to.include(productData);

    productId = _body.payload._id;
  });

  it("El endpoint PUT /api/extend/products/:id debe de actualizar un producto correctamente", async () => {
    expect(productId).to.not.be.undefined;

    const updatedProductData = {
      title: "Producto Actualizado",
      description: "Descripción actualizada del producto",
      price: 150,
      thumbnail: "imagen_actualizada.png",
      code: "XYZ789",
      stock: 15,
    };

    const { statusCode, _body } = await app
      .put(`/api/extend/products/${productId}`)
      .send(updatedProductData);

    expect(statusCode).to.equal(201);
    expect(_body.updated).to.include(updatedProductData);
  });

  it("El endpoint DELETE /api/extend/products/:id debe de eliminar un producto correctamente", async () => {
    expect(productId).to.not.be.undefined;

    const { statusCode } = await app.delete(
      `/api/extend/products/${productId}`
    );

    expect(statusCode).to.equal(201);
  });
});
