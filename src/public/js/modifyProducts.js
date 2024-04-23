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
