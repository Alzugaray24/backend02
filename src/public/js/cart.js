document.addEventListener("DOMContentLoaded", function () {
  const finalizeBtn = document.getElementById("finalizeBtn");

  finalizeBtn.addEventListener("click", async function () {
    window.location.href = "/successPurchase";
  });
});
