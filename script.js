let adminActivo = false;

// 📦 PRODUCTOS (con uno inicial incluido)
let productos = JSON.parse(localStorage.getItem("productos")) || [
    {
        id: 1,
        nombre: "Pollera Port Vila",
        precio: 4500,
        categoria: "pollera",
        imgs: ["img/pollera.jpg"],
        talles: "38",
        medidas: "Cintura: 39cm | Largo: 33cm",
        desc: "Es nueva, no la use nunca. Dice talle 16 pero va para un 38 ✧"
    }
];

let carrito = [];
let total = 0;
let productoActual = null;

/* =========================
   🛍️ MOSTRAR PRODUCTOS
========================= */
function mostrarProductos(lista) {
    const cont = document.getElementById("productos");
    cont.innerHTML = "";

    lista.forEach((p, i) => {
        let div = document.createElement("div");
        div.classList.add("producto");

        // delay animación tipo nike
        div.style.animationDelay = (i * 0.1) + "s";

        div.innerHTML = `
    <img src="${p.imgs[0].trim()}">
    <h3>${p.nombre}</h3>
    <p>$${p.precio}</p>
    ${adminActivo ? `<button class="btn-eliminar" onclick="eliminarProducto(${p.id})">🗑️</button>` : ""}
`;


        div.onclick = () => abrirModal(p.id);
        cont.appendChild(div);
    });
}

/* =========================
   📂 FILTROS
========================= */
function filtrar(cat) {
    if (cat === "todos") {
        mostrarProductos(productos);
    } else {
        let filtrados = productos.filter(p => p.categoria === cat);
        mostrarProductos(filtrados);
    }
}

/* =========================
   📦 MODAL PRODUCTO
========================= */
function abrirModal(id) {
    let p = productos.find(x => x.id === id);
    if (!p) return;

    productoActual = p;

    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-img").src = p.imgs[0].trim();

    document.getElementById("modal-nombre").textContent = p.nombre;
    document.getElementById("modal-precio").textContent = "$" + p.precio;
    document.getElementById("modal-talles").textContent = p.talles;
    document.getElementById("modal-medidas").textContent = p.medidas;
    document.getElementById("modal-desc").textContent = p.desc;

    // miniaturas
    let mini = document.getElementById("miniaturas");
    mini.innerHTML = "";

    p.imgs.forEach(img => {
        let im = document.createElement("img");
        im.src = img.trim();

        im.onclick = () => {
            document.getElementById("modal-img").src = img.trim();
        };

        mini.appendChild(im);
    });
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

function agregarDesdeModal() {
    if (!productoActual) return;

    // 🔍 REGLA DE PIEZA ÚNICA:
    // Verificamos si ya existe un producto con el mismo ID en el carrito
    let yaExiste = carrito.find(p => p.id === productoActual.id);

    if (yaExiste) {
        alert("¡Esta es una pieza única! Ya la tienes en tu carrito ✦");
        return; // Cortamos la ejecución aquí
    }

    // Si no existe, lo agregamos normalmente
    carrito.push(productoActual);
    total += productoActual.precio;

    actualizarCarrito();
    alert("¡Agregado al carrito! 🛒✨");
}

function actualizarCarrito() {
    let lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    carrito.forEach((item, i) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - $${item.precio}
            <button onclick="eliminar(${i})">✖</button>
        `;
        lista.appendChild(li);
    });

    document.getElementById("total").textContent = "Total: $" + total;
}

function eliminar(i) {
    if (!carrito[i]) return;

    total -= carrito[i].precio;
    carrito.splice(i, 1);

    actualizarCarrito();
}

function toggleCarrito() {
    document.getElementById("carritoBox").classList.toggle("hidden");
}

/* =========================
   💬 WHATSAPP CHECKOUT
========================= */
function comprarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let msg = "Pedido:%0A";

    carrito.forEach(p => {
        msg += `- ${p.nombre} ($${p.precio})%0A`;
    });

    msg += `Total: $${total}`;

    window.open(`https://wa.me/5491164469778?text=${msg}`);
}

/* =========================
   🔐 LOGIN ADMIN
========================= */
function mostrarLogin() {
    document.getElementById("loginPanel").classList.toggle("hidden");
}

function login() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;

    // Verifica las credenciales que definiste
    if (u === "Sofilinda" && p === "Pepeloco") {
        adminActivo = true;

        // Mostramos el panel de carga y ocultamos el de login
        document.getElementById("adminPanel").classList.remove("hidden");
        document.getElementById("loginPanel").classList.add("hidden");

        // 🔥 IMPORTANTE: Volvemos a renderizar los productos 
        // para que aparezca el botón de eliminar (basurita)
        mostrarProductos(productos); 
        
        alert("¡Acceso concedido, Administradora! ⚡");
    } else {
        alert("Datos incorrectos. Acceso denegado.");
    }
}

function agregarProducto() {
    // Capturamos el valor del input de imágenes
    let inputImgs = document.getElementById("imgs").value;
    
    // 🔥 Mejora: Limpiamos espacios y filtramos entradas vacías
    let listaImgs = inputImgs.split(",")
        .map(i => i.trim())
        .filter(i => i !== "");

    // Si no pusiste ninguna imagen, le asignamos una por defecto para que no rompa
    if (listaImgs.length === 0) {
        listaImgs = ["img/placeholder.jpg"]; 
    }

    let nuevo = {
        id: Date.now(),
        nombre: document.getElementById("nombre").value,
        precio: Number(document.getElementById("precio").value),
        categoria: document.getElementById("categoria").value,
        imgs: listaImgs, // <--- Aquí usamos la lista procesada
        talles: document.getElementById("talles").value,
        medidas: document.getElementById("medidas").value,
        desc: document.getElementById("desc").value
    };

    productos.push(nuevo);
    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos(productos);
    
    // Limpiamos los campos (Opcional pero recomendado)
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("imgs").value = "";
    // ... (puedes limpiar los demás campos aquí)
    
    alert("¡Producto con múltiples imágenes agregado! 📸✨");
}

/* =========================
   🚀 INICIO
========================= */
mostrarProductos(productos);

// 📸 ZOOM tipo Instagram
document.addEventListener("click", function(e){
    if(e.target.classList.contains("img-grande")){
        let zoom = document.createElement("div");

        zoom.style.position = "fixed";
        zoom.style.inset = "0";
        zoom.style.background = "rgba(0,0,0,0.95)";
        zoom.style.display = "flex";
        zoom.style.alignItems = "center";
        zoom.style.justifyContent = "center";
        zoom.style.zIndex = "999";

        let img = document.createElement("img");
        img.src = e.target.src;
        img.style.maxWidth = "90%";
        img.style.maxHeight = "90%";
        img.style.borderRadius = "10px";

        zoom.appendChild(img);

        zoom.onclick = () => zoom.remove();

        document.body.appendChild(zoom);
    }
});

function eliminarProducto(id){
    if(!adminActivo) return; // 🔐 seguridad

    let confirmar = confirm("¿Eliminar producto?");
    if(!confirmar) return;

    productos = productos.filter(p => p.id !== id);

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrarProductos(productos);
}

