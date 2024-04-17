document.addEventListener("DOMContentLoaded", function () {
  // Obtener el formulario
  const registerForm = document.getElementById("registerForm");

  // Agregar un evento al enviar el formulario
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Obtener los valores del formulario
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;

    // Crear un objeto con los datos del usuario
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      age: age,
      password: password,
    };

    try {
      // Enviar los datos al servidor utilizando fetch
      const response = await fetch("/api/extend/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Verificar si la solicitud fue exitosa
      if (response.ok) {
        // Redirigir a otra página o mostrar un mensaje de éxito
        console.log("Registro exitoso");
        window.location.href = "/login"; // Redirigir a una página de éxito
      } else {
        // Si la solicitud falla, mostrar un mensaje de error
        console.error("Error al registrar el usuario");
        const responseData = await response.json();
        console.error(responseData.error);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  });
});
