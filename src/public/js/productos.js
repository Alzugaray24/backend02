const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").files[0]; // Obtener el archivo seleccionado
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("thumbnail", thumbnail);
  formData.append("code", code);
  formData.append("stock", stock);

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    
    console.log(data);

    console.log("Respuesta del servidor:", data);

    if (data.status === "success") {
      Swal.fire("¡Producto agregado!", "El producto se ha agregado correctamente", "success")
        .then(() => {
          form.reset(); // Vaciar el formulario
        });
    } else {
      Swal.fire("¡Error!", data.msg || "Hubo un error al agregar el producto", "error");
    }
  } catch (error) {
    console.error("Error al enviar los datos al servidor:", error);
    Swal.fire("¡Error!", "Hubo un error al enviar los datos al servidor", "error");
  }
});
