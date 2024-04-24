document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");

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
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Te has registrado con éxito!",
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        const responseData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.error,
        });
      }
    } catch (error) {
      throw error;
    }
  });
});
