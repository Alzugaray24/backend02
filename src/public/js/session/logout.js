const logoutForm = document.getElementById("logoutForm");

logoutForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Evitar el comportamiento por defecto del formulario

  // Enviar una solicitud POST a la ruta de logout
  fetch("/users/logout", { // Cambia la ruta para que coincida con la ruta de logout en el servidor
    method: "POST"
  })
  .then(response => {
    if (response.ok) {
        
    } else {
      console.error("Error en la solicitud de logout:", response.statusText);
      // Manejar el error si es necesario
    }
  })
  .catch(error => {
    console.error("Error en la solicitud de logout:", error);
    // Manejar el error si es necesario
  });
});