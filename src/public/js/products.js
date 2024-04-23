document.addEventListener("DOMContentLoaded", function () {
  const addToCartForms = document.querySelectorAll(".add-to-cart-form");

  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const productId = form.dataset._id;

      console.log(form.dataset);

      const productData = {
        productId: productId,
        quantity: 1,
      };

      try {
        const response = await fetch("/api/extend/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Error al agregar producto al carrito");
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
      }
    });
  });
});
