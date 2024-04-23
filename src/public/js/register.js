document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const errorContainer = document.getElementById("error-container");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const password = document.getElementById("password").value;

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      age: age,
      password: password,
    };

    try {
      const response = await fetch("/api/extend/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("Registro exitoso");
        window.location.href = "/login";
      } else {
        const responseData = await response.json();
        console.error(responseData.error);
        errorContainer.textContent = responseData.error;
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  });
});
