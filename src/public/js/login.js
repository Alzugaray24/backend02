document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/extend/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.error,
        });
        return; // Detener la ejecución aquí para evitar que el código restante se ejecute en caso de error
      }

      const data = await response.json();
      console.log(data);

      document.cookie = `token=${data.token}; path=/`;

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "¡Te has conectado exitosamente!",
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  });
});
