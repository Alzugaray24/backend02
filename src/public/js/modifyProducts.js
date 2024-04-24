const deleteButtons = document.querySelectorAll(".delete-product-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset._id;

    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );

    if (confirmDelete) {
      fetch(`/api/extend/products/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Producto eliminado correctamente");
            location.reload();
          } else {
            console.error("Error al eliminar el producto");
          }
        })
        .catch((error) => {
          console.error("Error al enviar la solicitud de eliminación:", error);
        });
    }
  });
});

const updateButtons = document.querySelectorAll(".update-product-btn");

updateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset._id;

    const confirmUpdate = confirm(
      "¿Estás seguro de que quieres actualizar este producto?"
    );

    if (confirmUpdate) {
      const title = prompt("Ingrese el nombre del producto:");
      const description = prompt("Ingrese la descripción:");
      const price = parseFloat(prompt("Ingrese el precio:"));
      const thumbnail = prompt("Ingrese la URL de la imagen:");
      const code = prompt("Ingrese el código: ");
      const stock = parseInt(prompt("Ingrese el stock: "));

      const updatedProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      console.log(updatedProduct);

      fetch(`/api/extend/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Producto actualizado correctamente");
          } else {
            console.error("Error al actualizar el producto");
          }
        })
        .catch((error) => {
          console.error(
            "Error al enviar la solicitud de actualización:",
            error
          );
        });
    }
  });
});
