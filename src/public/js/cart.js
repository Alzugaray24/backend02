document.addEventListener("DOMContentLoaded", function () {
  const finalizeBtn = document.getElementById("finalizeBtn");

  // Agregar un event listener para el clic en el botón "Finalizar compra"
  finalizeBtn.addEventListener("click", async function () {
    // Redirigir al usuario a la página de éxito
    window.location.href = "/successPurchase";
  });
});
