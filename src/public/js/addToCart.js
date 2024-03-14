// Seleccionar todos los botones con el id "botones"
const botones = document.querySelectorAll('#addToCart');

// Iterar sobre cada botón y agregar un evento clic
botones.forEach(button => {
  button.addEventListener('click', async () => {
    // Obtener el ID del producto del atributo data-product-id
    const productId = button.getAttribute('data-product-id');

    console.log(productId);
    try {
      // Realizar la solicitud POST a la ruta adecuada para agregar el producto al carrito
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });
      
      if (response.ok) {
        // Manejar la respuesta si la solicitud fue exitosa
        Swal.fire('¡Producto agregado!', 'El producto se ha agregado al carrito con éxito', 'success');
      } else {
        // Manejar la respuesta si la solicitud no fue exitosa
        Swal.fire('¡Error!', 'Hubo un problema al agregar el producto al carrito', 'error');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error);
      Swal.fire('¡Error!', 'Hubo un error al conectar con el servidor', 'error');
    }
  });
});
