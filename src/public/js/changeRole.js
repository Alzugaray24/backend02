document.addEventListener("DOMContentLoaded", function () {
  const deleteUserBtns = document.querySelectorAll(".delete-user-btn");

  deleteUserBtns.forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const userId = btn.getAttribute("data-_id");

      // Mostrar SweetAlert para confirmar la eliminación del usuario
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "Esta acción eliminará al usuario de forma permanente. ¿Deseas continuar?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar usuario",
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/extend/users/delete/${userId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("No se pudo eliminar el usuario");
          }

          // Mostrar SweetAlert de éxito
          Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: "El usuario ha sido eliminado con éxito.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then(() => {
            location.reload();
          });
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
          // Mostrar SweetAlert de error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ha ocurrido un error al eliminar el usuario. Por favor, intenta de nuevo más tarde.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });
        }
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const changeRoleButtons = document.querySelectorAll(".change-role-btn");

  changeRoleButtons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const userId = button.getAttribute("data-_id");

      // Mostrar SweetAlert con un campo de entrada para el nuevo rol
      const { value: newRole } = await Swal.fire({
        title: "Ingrese el nuevo rol del usuario:",
        input: "text",
        inputPlaceholder: "Nuevo Rol",
        inputValidator: (value) => {
          if (!value) {
            return "Debes ingresar un rol";
          }
          // Validar que el rol ingresado sea válido
          const allowedRoles = ["user", "user_premium", "admin"];
          if (!allowedRoles.includes(value.toLowerCase())) {
            return "El rol ingresado no es válido";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Cambiar Rol",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (newRole) => {
          try {
            const response = await fetch(
              `/api/extend/users/${userId}/change/${newRole}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Error al cambiar el rol del usuario.");
            }

            return true;
          } catch (error) {
            console.error("Error:", error);
            Swal.showValidationMessage(
              `Ha ocurrido un error al cambiar el rol del usuario: ${error}`
            );
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      if (newRole) {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: "success",
          title: "Rol cambiado",
          text: "El rol del usuario ha sido cambiado con éxito.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          location.reload();
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".inactive-users")
    .addEventListener("click", async function () {
      // Mostrar SweetAlert para confirmar la eliminación
      const result = await Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "Este proceso eliminará todos los usuarios inactivos de los últimos 2 días. ¿Estás seguro de que deseas realizar esta acción?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar usuarios",
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/extend/users`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("No se pudo eliminar los usuarios inactivos");
          }

          const data = await response.json(); // Convertir la respuesta a JSON
          console.log(data);

          // Mostrar SweetAlert con el número de usuarios eliminados
          Swal.fire({
            icon: "success",
            title: "Usuarios eliminados con éxito",
            text: `Se eliminaron ${data.msg} usuarios inactivos.`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          });

          // location.reload();
        } catch (error) {
          console.error(
            "Error al eliminar los usuarios inactivos:",
            error.message
          );
        }
      }
    });
});
