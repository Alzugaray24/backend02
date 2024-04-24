document.addEventListener("DOMContentLoaded", function () {
  const addToCartForms = document.querySelectorAll(".add-to-cart-form");

  addToCartForms.forEach((form) => {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const productId = form.dataset._id;

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

        if (response.ok) {
          const data = await response.json();
          Swal.fire({
            icon: "success",
            title: "Producto agregado al carrito",
            text: `El producto se ha agregado correctamente al carrito!`,
          });
        } else {
          const responseData = await response.json();
          Swal.fire({
            icon: "error",
            title: "Error",
            text: responseData.error,
          });
        }
      } catch (error) {
        throw error;
      }
    });
  });
});
