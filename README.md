Aplicación de Comercio Electrónico
Esta aplicación de comercio electrónico es una plataforma completa desarrollada en Node.js utilizando Express como framework del lado del servidor y Handlebars como motor de plantillas para el frontend. La base de datos está gestionada por MongoDB, proporcionando una estructura flexible y escalable para almacenar datos relacionados con usuarios, productos y carritos de compra.

Funcionalidades Principales
Gestión de Usuarios
Los usuarios pueden registrarse en la plataforma proporcionando su información básica, como nombre, apellido, correo electrónico y contraseña. Una vez registrados, pueden iniciar sesión para acceder a sus perfiles y realizar compras.

Catálogo de Productos
La aplicación cuenta con un amplio catálogo de productos que los usuarios pueden explorar y agregar al carrito de compras. Cada producto incluye detalles como nombre, descripción, precio y disponibilidad.

Carrito de Compras
Los usuarios pueden agregar productos al carrito de compras, ajustar las cantidades y eliminar productos según sea necesario. El carrito de compras muestra un resumen detallado de los productos seleccionados y el total a pagar.

Proceso de Compra
Una vez que los usuarios hayan seleccionado los productos deseados, pueden proceder al proceso de compra. Durante el proceso de pago, se solicitarán los detalles de envío y facturación, y se aplicarán los métodos de pago configurados.

Gestión de Pedidos
Después de completar una compra, los usuarios pueden revisar el historial de pedidos para realizar un seguimiento de sus compras anteriores. Cada pedido incluye detalles como el número de pedido, la fecha de compra, los productos adquiridos y el estado del pedido.

Estructura del Proyecto
src/: Directorio principal del código fuente de la aplicación.
controllers/: Controladores de ruta para gestionar las solicitudes HTTP.
models/: Definiciones de esquemas y modelos para interactuar con la base de datos MongoDB.
routes/: Definición de las rutas de la aplicación.
public/: Recursos estáticos como archivos CSS, imágenes y JavaScript.
views/: Plantillas Handlebars para renderizar el frontend de la aplicación.
dirname.js: Utilidades y funciones auxiliares para el funcionamiento de la aplicación.
config/: Configuraciones de la aplicación, como variables de entorno y archivos de configuración.
middlewares/: Middleware personalizados para gestionar aspectos como la autenticación y la autorización.
app.js: Punto de entrada principal de la aplicación.
Instalación y Uso
Clona este repositorio en tu máquina local.
Instala las dependencias utilizando npm o yarn: npm install o yarn install.
Configura las variables de entorno necesarias, como la URL de conexión a la base de datos MongoDB y las credenciales de autenticación del servidor de correo electrónico.
Inicia la aplicación ejecutando npm start o yarn start.
Abre tu navegador web y accede a la URL proporcionada.
¡Disfruta explorando esta aplicación de comercio electrónico y experimenta todas sus funcionalidades!

