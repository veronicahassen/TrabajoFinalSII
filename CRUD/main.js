const cardsContainer = document.getElementById("cards-container");
const formularioCargar = document.getElementById("formulario-cargar");
const formularioModificar = document.getElementById("formulario-modificar");

const url = "https://veronicahassen.pythonanywhere.com/productos";

// Cargar productos existentes
fetch(url)
  .then(res => res.json())
  .then(res => {
    res.forEach(producto => {
      createCard(producto);
    });
  })
  .catch(err => console.log(err));

// Crear una card para un producto
function createCard(producto) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
        <div class="card-content">
            <div>ID: ${producto.id}</div>
            <div>Nombre: ${producto.nombre}</div>
            <div><img src="${producto.imagen}" alt="${producto.nombre}" class="card-image"></div>
            <div>Precio: ${producto.precio}</div>
            <div>Stock: ${producto.stock}</div>
        </div>
        <div class="card-buttons">
            <button class="delete-button" data-id="${producto.id}">
                <img src="./IMG/borrar.png" alt="borrar">
            </button>
            <button class="modify-button" data-id="${producto.id}">
                <img src="./IMG/editar.png" alt="editar">
            </button>
        </div>
    `;

  cardsContainer.appendChild(card);
}



formularioCargar.style.display = "none";
formularioModificar.style.display = "none";


// Mostrar formulario de carga al hacer clic en el botón "Cargar producto"
const botonCargar = document.getElementById("boton-cargar");
botonCargar.addEventListener("click", () => {
  formularioCargar.style.display = "block";
  formularioModificar.style.display = "none";
});

// Evento para cargar un producto
formularioCargar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("cargar-nombre").value;
  const imagen = document.getElementById("cargar-imagen").value;
  const precio = document.getElementById("cargar-precio").value;
  const stock = document.getElementById("cargar-stock").value;

  const producto = {
    nombre,
    imagen,
    precio,
    stock
  };

  fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Producto cargado:", data);
      createCard(data);
      formularioCargar.style.display = "none";
      formularioCargar.reset();
    })
    .catch(err => console.log(err));
});

// Evento para borrar un producto
cardsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const card = event.target.closest(".card");
    const productId = event.target.getAttribute("data-id");

    fetch(`${url}/${productId}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        console.log(`Producto eliminado: ${data.id}`);
        card.remove();
      })
      .catch(err => console.log(err));
  }
});

// Mostrar formulario de modificación al hacer clic en el botón "Modificar"
const botonesModificar = document.getElementsByClassName("modify-button");
for (const boton of botonesModificar) {
  boton.addEventListener("click", () => {
    formularioModificar.style.display = "block";
    formularioCargar.style.display = "none";
    document.body.classList.add("overlay"); 
  });
}
// Evento para modificar un producto
cardsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("modify-button")) {
    const card = event.target.closest(".card");
    const productId = event.target.getAttribute("data-id");

    const nombreActual = card.querySelector(".card-content > div:nth-child(2)").textContent;
    const imagenActual = card.querySelector(".card-image").getAttribute("src");
    const precioActual = card.querySelector(".card-content > div:nth-child(4)").textContent;
    const stockActual = card.querySelector(".card-content > div:nth-child(5)").textContent;

    formularioModificar.querySelector("#modificar-nombre").value = nombreActual;
    formularioModificar.querySelector("#modificar-imagen").value = imagenActual;
    formularioModificar.querySelector("#modificar-precio").value = precioActual;
    formularioModificar.querySelector("#modificar-stock").value = stockActual;

    formularioModificar.style.display = "block";

    formularioModificar.addEventListener("submit", (e) => {
      e.preventDefault();
      document.body.classList.remove("overlay");

      const nombreModificado = formularioModificar.querySelector("#modificar-nombre").value;
      const imagenModificado = formularioModificar.querySelector("#modificar-imagen").value;
      const precioModificado = formularioModificar.querySelector("#modificar-precio").value;
      const stockModificado = formularioModificar.querySelector("#modificar-stock").value;

      const productoModificado = {
        nombre: nombreModificado,
        imagen: imagenModificado,
        precio: precioModificado,
        stock: stockModificado
      };

      fetch(`${url}/${productId}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoModificado)
      })
        .then(res => res.json())
        .then(data => {
          console.log(`Producto modificado: ${data.id}`);
          card.querySelector(".card-content > div:nth-child(2)").textContent = data.nombre;
          card.querySelector(".card-image").setAttribute("src", data.imagen);
          card.querySelector(".card-content > div:nth-child(4)").textContent = data.precio;
          card.querySelector(".card-content > div:nth-child(5)").textContent = data.stock;
          formularioModificar.style.display = "none";
        })
        .catch(err => console.log(err));
    })
  }
})