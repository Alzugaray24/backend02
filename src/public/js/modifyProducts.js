const deleteButtons = document.querySelectorAll(".delete-product-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset._id;

    Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto de forma permanente. ¿Deseas continuar?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar producto",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/extend/products/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Producto eliminado",
                text: "El producto ha sido eliminado correctamente.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
              }).then(() => {
                location.reload();
              });
            } else {
              console.error("Error al eliminar el producto");
            }
          })
          .catch((error) => {
            console.error(
              "Error al enviar la solicitud de eliminación:",
              error
            );
          });
      }
    });
  });
});

const updateButtons = document.querySelectorAll(".update-product-btn");

updateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset._id;

    // Mostrar SweetAlert con un formulario para actualizar el producto
    Swal.fire({
      icon: "question",
      title: "¿Estás seguro?",
      text: "Esta acción actualizará el producto. ¿Deseas continuar?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, actualizar producto",
      showLoaderOnConfirm: true,
      html:
        `<input id="swal-input-title" class="swal2-input" placeholder="Nombre del producto">` +
        `<input id="swal-input-description" class="swal2-input" placeholder="Descripción">` +
        `<input id="swal-input-price" class="swal2-input" placeholder="Precio">` +
        `<input id="swal-input-thumbnail" class="swal2-input" placeholder="URL de la imagen">` +
        `<input id="swal-input-code" class="swal2-input" placeholder="Código">` +
        `<input id="swal-input-stock" class="swal2-input" placeholder="Stock">`,
      preConfirm: () => {
        const title = document.getElementById("swal-input-title").value;
        const description = document.getElementById(
          "swal-input-description"
        ).value;
        const price = parseFloat(
          document.getElementById("swal-input-price").value
        );
        const thumbnail = document.getElementById("swal-input-thumbnail").value;
        const code = document.getElementById("swal-input-code").value;
        const stock = parseInt(
          document.getElementById("swal-input-stock").value
        );

        const updatedProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };

        return fetch(`/api/extend/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al actualizar el producto");
            }
            return response.json();
          })
          .catch((error) => {
            Swal.showValidationMessage(
              `Error al enviar la solicitud de actualización: ${error}`
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto ha sido actualizado correctamente.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          location.reload();
        });
      }
    });
  });
});
