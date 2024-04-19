document.addEventListener("DOMContentLoaded", function () {
  const finalizeBtn = document.getElementById("finalizeBtn");

  // Agregar un event listener para el clic en el botón "Finalizar compra"
  finalizeBtn.addEventListener("click", async function () {
    try {
      const response = await fetch("/api/extend/cart/purchase", {
        method: "POST", // Método de solicitud
        headers: {
          "Content-Type": "application/json", // Tipo de contenido
        },
        body: JSON.stringify({}), // No hay datos necesarios para este endpoint en particular
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Error al finalizar la compra"); // Manejar errores de la solicitud
      }

      const data = await response.json(); // Convertir la respuesta a JSON

      // Redirigir al usuario a la página de éxito y pasar los datos como parámetros de consulta en la URL
      window.location.href = `/successPurchase?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`;
    } catch (error) {
      console.error("Error:", error); // Manejar errores de la solicitud
      // Podrías mostrar un mensaje de error al usuario si la solicitud falla
    }
  });
});
