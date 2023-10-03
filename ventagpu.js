const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
const carrito = carritoStorage || [];
let total = 0;
carrito.forEach((producto) => {
  total += producto.precio * producto.cantidad;
});
actualizarCarrito();

function abrirCarrito() {
  const offcanvas = new bootstrap.Offcanvas(
    document.getElementById("offcanvasScrolling")
  );
  offcanvas.show();
}

function agregarCarrito(productoNombre, precio) {
  const existente = carrito.find(
    (producto) => producto.nombre === productoNombre
  );
  if (existente) {
    existente.cantidad++;
  } else {
    const producto = { nombre: productoNombre, precio: precio, cantidad: 1 };
    carrito.push(producto);
  }
  total += precio;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  abrirCarrito();
}

function quitarCarrito(index) {
  const quitarProducto = carrito[index];
  if (quitarProducto.cantidad > 1) {
    quitarProducto.cantidad--;
    total -= quitarProducto.precio;
  } else {
    total -= quitarProducto.precio;
    carrito.splice(index, 1);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const productosCarrito = document.getElementById("productosCarrito");
  productosCarrito.innerHTML = "";

  carrito.forEach((producto, index) => {
    const listaProducto = document.createElement("p");
    listaProducto.textContent = `${producto.cantidad} ${producto.nombre} Precio: $${producto.precio}`;

    const quitarBoton = document.createElement("button");
    quitarBoton.classList.add("btn", "btn-outline-danger", "btn-sm");
    quitarBoton.textContent = "Eliminar";
    quitarBoton.addEventListener("click", () => {
      quitarCarrito(index);
      actualizarCarrito();
    });

    listaProducto.appendChild(quitarBoton);
    productosCarrito.appendChild(listaProducto);
  });

  const totalProductos = document.getElementById("totalCarrito");
  totalProductos.textContent = `TOTAL: $${total}`;
}

const agregarProdCarrito = document.querySelectorAll(".agregar-carrito-btn");
agregarProdCarrito.forEach((boton) => {
  boton.addEventListener("click", () => {
    const nombreProducto = boton.dataset.nombre;
    const precioProducto = parseFloat(boton.dataset.precio);

    agregarCarrito(nombreProducto, precioProducto);
    actualizarCarrito();
  });
});
