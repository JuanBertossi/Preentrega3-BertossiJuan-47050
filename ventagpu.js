class Producto {
  constructor(id, nombre, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

//Offcanvas

function abrirCarrito() {
  const offcanvas = new bootstrap.Offcanvas(
    document.getElementById("offcanvasScrolling")
  );
  offcanvas.show();
}

//BD

class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.cargarRegistros();
  }

  async cargarRegistros() {
    const resultado = await fetch("./json/productos.json");
    this.productos = await resultado.json();
    cargarProductos(this.productos);
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }
}

//Carrito

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidadProductos = 0;
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
    Toastify({
      text: `Se ha agregado "${producto.nombre}" de su Carrito`,
      gravity: "bottom",
      position: "center",
      style: {
        background: "#74d680",
      },
    }).showToast();
    abrirCarrito();
  }

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    const productoQuitado = this.carrito[indice];
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
    Toastify({
      text: `Se ha quitado "${productoQuitado.nombre}" de su Carrito`,
      gravity: "bottom",
      position: "center",
      style: {
        background: "#ff7878",
      },
    }).showToast();
  }

  listar() {
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h2>${producto.nombre}</h2>
          <p>Precio: $${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar btn btn-outline-danger" data-id="${producto.id}">Quitar del carrito</a>
        </div>
      `;
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }
    CantidadProductos.innerText = `Cantidad Total: ${this.cantidadProductos}`;
    TotalCarrito.innerText = `TOTAL: $${this.total}`;
  }
}

const divCarrito = document.querySelector("#carrito");
const CantidadProductos = document.querySelector("#cantidadProductos");
const TotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");

const bd = new BaseDeDatos();
const carrito = new Carrito();

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" />
        </div>
        <a href="#" class="btnAgregar btn btn-outline-success" data-id="${producto.id}">Agregar al carrito</a>
      </div>
    `;
  }
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = Number(boton.dataset.id);
      const producto = bd.registroPorId(idProducto);
      carrito.agregar(producto);
    });
  }
}
