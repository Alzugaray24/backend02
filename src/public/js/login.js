document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que se envíe el formulario automáticamente

    // Obtener los valores de los campos de entrada
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Crear un objeto con los datos del formulario
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
        body: JSON.stringify(formData), // Convertir el objeto a formato JSON
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json();
      window.location.href = "/";
      console.log(data); // Aquí puedes manejar la respuesta del servidor, como redireccionar a otra página o mostrar un mensaje al usuario
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  });
});
