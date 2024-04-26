import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.APP_STRIPE_KEY ||
    "pk_test_51P8O2ORurY0CPhSO3gGTSlaexZyzPjwu0iOQKBX7PoQ85OVagSdaCrfYED1a7DJRW3Bjt46qzmQuJ126qFmdmfvU00vYFQyuoP"
);

console.log(stripePromise);

document.addEventListener("DOMContentLoaded", function () {
  const finalizeBtn = document.getElementById("finalizeBtn");

  finalizeBtn.addEventListener("click", async function () {
    alert("jjsakds");
  });
});
