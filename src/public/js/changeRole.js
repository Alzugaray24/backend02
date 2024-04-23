document.addEventListener("DOMContentLoaded", function () {
  const deleteUserBtns = document.querySelectorAll(".delete-user-btn");

  deleteUserBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const userId = btn.getAttribute("data-_id");
      console.log(userId);

      fetch(`/api/extend/users/delete/${userId}`, {
        method: "DELETE",
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("No se pudo eliminar el usuario");
          }
          location.reload();
        })
        .catch(function (error) {
          console.error("Error al eliminar el usuario:", error);
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

      newRole = newRole.toLowerCase();

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

      location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Ha ocurrido un error al cambiar el rol del usuario.");
    }
  }
});
