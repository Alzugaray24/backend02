document.addEventListener("DOMContentLoaded", function () {
  const finalizeBtn = document.getElementById("finalizeBtn");

  finalizeBtn.addEventListener("click", async function () {
    // Redireccionar a "/successPurchase"
    window.location.href = "/successPurchase";
  });
});
