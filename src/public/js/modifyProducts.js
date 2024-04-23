// Selección del botón "Eliminar Producto"
const deleteButtons = document.querySelectorAll(".delete-product-btn");

// Iterar sobre cada botón y agregar un event listener
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Obtener el ID del producto desde el atributo data-_id
    const id = button.dataset._id;

    // Confirmar si el usuario realmente quiere eliminar el producto
    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );

    // Si el usuario confirma, enviar la solicitud de eliminación al backend
    if (confirmDelete) {
      // Enviar la solicitud DELETE al backend utilizando Fetch API o Axios
      fetch(`/api/extend/products/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Producto eliminado exitosamente, realizar alguna acción adicional si es necesario
            console.log("Producto eliminado correctamente");
            // Recargar la página o actualizar la lista de productos, etc.
            location.reload(); // Por ejemplo, recargar la página
          } else {
            // Error al eliminar el producto
            console.error("Error al eliminar el producto");
            // Mostrar un mensaje de error o realizar alguna otra acción en caso de error
          }
        })
        .catch((error) => {
          // Error en la solicitud
          console.error("Error al enviar la solicitud de eliminación:", error);
          // Mostrar un mensaje de error o realizar alguna otra acción en caso de error
        });
    }
  });
});
