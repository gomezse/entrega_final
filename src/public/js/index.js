// Crear una instancia del cliente Socket.io
const socketClient = io();

const form = document.getElementById("chat-form");
const containerProducts = document.getElementById("container-products");
const userName = document.getElementById("name");
const inputMessage = document.getElementById("message");
const divChat = document.getElementById("chat");


// -------------------------BLOQUE GESTION USUARIOS ------------------------
Swal.fire({
    title: "Bienvenido al Ecommerce.",
    text: "Ingrese su email",
    input: "text",
    inputValidator: (value) => {
        // Expresión regular para validar el formato de correo electrónico
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!emailRegex.test(value)) {
            return "El correo ingresado no es valido.";
        }

    },
    confirmButtonText: "Enter",
}).then((input) => {
    user = input.value;
    userName.innerText = user;
    socketClient.emit("newUser", user);
});

socketClient.on("userConnected", (user) => {
    Toastify({
        text: `${user} se conectó  a la tienda.`,
        style: {
            color: "#fff",
            background: ""
        },
        duration: 5000,
    }).showToast();
});


socketClient.on("connected", () => {
    Toastify({
        text: `Estas conectado.`,
        style: {
            color: "#fff",
            background: ""
        },
        duration: 5000,
    }).showToast();
});




//------------------------------BLOQUE LISTADO PRODUCTOS-----------------------------------------

//Evento que gestiona el listado de todos los productos en pantalla.
socketClient.on("listProducts", (productList) => {
    const products = productList
        .map((p) => {
            return `    <article id="product-${p.id}" class="container">
            <div class="card">
                <div class="imgBx">
                    <img src="${p.thumbnails}" height="200" width="20" />
                </div>
                <div class="contentBx">
                    <h2>${p.title}</h2>
                    <div class="price">
                        <h3>Precio: ${p.price}</h3>
                    </div>
                    <div class="stock">
                        <h3>Cantidad: ${p.stock}</h3>
                    </div>
                    <input type="button" onclick="eliminar(${p.id})" value="Eliminar Producto"></input>
                 
                </div>
            </div>
        </article>`;
        })   // <input type="button" onclick="eliminar(${p.id})" value="Eliminar Producto"></input>
        .join(" ");
    containerProducts.innerHTML = products;
});

socketClient.on("chat", (messages) => {
    const chat = messages
        .map((m) => {
            return `<p>${m.user}: ${m.message}</p>`;
        })
        .join(" ");
    divChat.innerHTML = chat;
});

form.onsubmit = (e) => {
    e.preventDefault();
    const infoMessage = {
        user: userName.innerText,
        message: inputMessage.value,
    };
    inputMessage.innerText = "";
    socketClient.emit("message", infoMessage);
};


document.addEventListener("DOMContentLoaded", function() {
  const addToCartLink = document.getElementById("addToCartLink");

  if (addToCartLink) {
    addToCartLink.addEventListener("click", function(event) {
      event.preventDefault(); // Evita que el enlace navegue a la URL

      // Obtiene la URL del enlace
      const url = addToCartLink.getAttribute("href");

      // Realiza la solicitud a la API usando fetch
      fetch(url, {
        method: "POST", // O el método adecuado para agregar productos al carrito
      })
      .then(response => response.json())
      .then(data => {
        // Procesa la respuesta de la API, por ejemplo, mostrar un mensaje de éxito
        console.log("Producto agregado al carrito:", data);
      })
      .catch(error => {
        console.error("Error al agregar el producto al carrito:", error);
      });
    });
  }
});

