document.addEventListener("DOMContentLoaded", function () {
  const deleteUserBtns = document.querySelectorAll(".delete-user-btn");

  deleteUserBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Obtener el ID del usuario del atributo data-_id
      const userId = btn.getAttribute("data-_id");
      console.log(userId);

      // Enviar una solicitud al backend para eliminar el usuario con el ID correspondiente
      fetch(`/api/extend/users/delete/${userId}`, {
        method: "DELETE",
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("No se pudo eliminar el usuario");
          }
          // Opcional: Recargar la página o actualizar la lista de usuarios después de eliminar
          location.reload(); // Recargar la página
        })
        .catch(function (error) {
          console.error("Error al eliminar el usuario:", error);
          // Manejar el error adecuadamente, por ejemplo, mostrar un mensaje de error al usuario
        });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const changeRoleButtons = document.querySelectorAll(".change-role-btn");

  changeRoleButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      const userId = button.getAttribute("data-_id");
      let newRole = prompt("Ingrese el nuevo rol del usuario:");

      // Convertir el nuevo rol a minúsculas
      newRole = newRole.toLowerCase();

      // Validar que el nuevo rol sea uno de los valores permitidos
      const allowedRoles = ["user", "user_premium", "admin"];
      if (!allowedRoles.includes(newRole)) {
        alert("El rol ingresado no es válido.");
        return;
      }

      if (newRole) {
        changeRole(userId, newRole);
      }
    });
  });

  async function changeRole(userId, newRole) {
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

      alert("Rol del usuario cambiado con éxito.");

      location.reload(); // Recargar la página
      // Aquí podrías agregar lógica adicional, como recargar la página o actualizar la lista de usuarios.
    } catch (error) {
      console.error("Error:", error);
      alert("Ha ocurrido un error al cambiar el rol del usuario.");
    }
  }
});
