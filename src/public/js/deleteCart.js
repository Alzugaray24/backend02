// Seleccionar todos los botones de eliminación del carrito
const deleteButtons = document.querySelectorAll('.btn-remove-from-cart');

// Iterar sobre cada botón y agregar un evento clic
deleteButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    // Evitar que el formulario se envíe
    event.preventDefault();

    // Obtener el ID del carrito del atributo data-cart-id del botón actual
    const cartId = button.getAttribute('data-cart-id');

    console.log(cartId);

    try {
      // Realizar la solicitud DELETE a la ruta adecuada para eliminar el carrito por su ID
      const response = await fetch(`/api/carts/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Manejar la respuesta si la solicitud fue exitosa
        Swal.fire('¡Carrito eliminado!', 'El carrito ha sido eliminado correctamente', 'success');
        // Recargar la página para mostrar los carritos actualizados
        location.reload();
      }
      else {
        // Manejar la respuesta si la solicitud no fue exitosa
        console.log(response);
        Swal.fire('¡Error!', 'Hubo un problema al eliminar el carrito', 'error');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud DELETE:', error);
      Swal.fire('¡Error!', 'Hubo un error al conectar con el servidor', 'error');
    }
  });
});
