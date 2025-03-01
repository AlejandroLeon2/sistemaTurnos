document.addEventListener("DOMContentLoaded", function () {
    const dniInput = document.getElementById("dniInput");
    const buscarDNIButton = document.getElementById("buscarDNIButton");
    const mensajeError = document.getElementById("mensajeError");    
    
    // Cargar la base de datos desde localStorage
    let baseDeDatos;
    try {
        const data = localStorage.getItem("baseDeDatos");
        baseDeDatos = data ? JSON.parse(data) : { clientes: [], noClientes: [] };
    } catch (error) {
        baseDeDatos = { clientes: [], noClientes: [] };
    }

    // Cargar los tickets desde localStorage
    let tickets;
    try {
        const data = localStorage.getItem("tickets");
        tickets = data ? JSON.parse(data) : [];
    } catch (error) {
        tickets = [];
    }

    // Cargar los contadores desde localStorage
    let contadores;
    try {
        const data = localStorage.getItem("contadores");
        contadores = data ? JSON.parse(data) : { CG: 0, SC: 0, CR: 0, G: 0 };
    } catch (error) {
        contadores = { CG: 0, SC: 0, CR: 0, G: 0 };
    }

    // Inicializar contadores y tickets si no existen
    if (!localStorage.getItem("contadores")) {
        localStorage.setItem("contadores", JSON.stringify({ CG: 0, SC: 0, CR: 0, G: 0 }));
    }

    if (!localStorage.getItem("tickets")) {
        localStorage.setItem("tickets", JSON.stringify([]));
    }

    // Función para generar un ticket
    window.generarTicket = function (servicio) {
        const personaActual = JSON.parse(localStorage.getItem("personaActual"));

        if (personaActual) {
            // Obtener los contadores y tickets actuales
            const contadores = JSON.parse(localStorage.getItem("contadores"));
            const tickets = JSON.parse(localStorage.getItem("tickets"));

            // Incrementar el contador correspondiente
            contadores[servicio] += 1;
            const codigo = `${servicio}${String(contadores[servicio]).padStart(3, '0')}`;

            // Crear el ticket
            const ticket = {
                codigo: codigo,
                nombre: personaActual.nombre,
                servicio: servicio,
                fecha: new Date().toLocaleString()
            };

            // Agregar el ticket al arreglo
            tickets.push(ticket);

            // Guardar en localStorage
            localStorage.setItem("tickets", JSON.stringify(tickets));
            localStorage.setItem("contadores", JSON.stringify(contadores));

            // Redirigir a la página de espera
            window.location.href = "listaDespera.html";
        } else {
            alert("No se ha ingresado un DNI válido.");
        }
    };

    // Función para mostrar los tickets en la página de espera
    function mostrarTickets() {
        const listaEspera = document.getElementById("listaEspera");
        const contadorClientes = document.getElementById("contadorClientes");

        if (listaEspera && contadorClientes) {
            // Obtener los tickets desde localStorage
            const tickets = JSON.parse(localStorage.getItem("tickets"));

            // Limpiar la lista
            listaEspera.innerHTML = "";

            // Mostrar los tickets en el orden de ingreso
            tickets.forEach((ticket) => {
                const item = document.createElement("div");
                item.className = "list-group-item";
                item.innerHTML = `
                    <strong>Código:</strong> ${ticket.codigo}<br>
                    <strong>Nombre:</strong> ${ticket.nombre}<br>
                    <strong>Servicio:</strong> ${ticket.servicio}<br>
                    <strong>Fecha:</strong> ${ticket.fecha}
                `;
                listaEspera.appendChild(item);
            });

            // Actualizar el contador de clientes
            contadorClientes.textContent = tickets.length;
        }
    }

    // Mostrar los tickets al cargar la página de espera
    mostrarTickets();

    // Función para validar el DNI
    function validarDNI(dni) {
        const regex = /^\d{8}$/; // Solo 8 dígitos numéricos
        return regex.test(dni);
    }

    // Función para buscar un DNI en la base de datos
    function buscarDNI(dni) {
        const cliente = baseDeDatos.clientes.find((c) => c.dni === dni);
        if (cliente) return { ...cliente, esCliente: true };

        const noCliente = baseDeDatos.noClientes.find((nc) => nc.dni === dni);
        if (noCliente) return { ...noCliente, esCliente: false };

        return null; // Si no se encuentra
    }

    // Función para generar una persona aleatoria
    function generarPersona(dni) {
        const nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofía"];
        const apellidos = ["Pérez", "García", "López", "Martínez", "González", "Rodríguez", "Fernández"];
        const nombre = `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`;
        const correo = `${nombre.toLowerCase().replace(/\s/g, '')}@example.com`;
        const edad = Math.floor(Math.random() * (99 - 18 + 1)) + 18;

        return { dni, nombre, correo, edad };
    }

    // Función para agregar una nueva persona a la base de datos
    function agregarPersona(dni, esCliente) {
        const nuevaPersona = generarPersona(dni);

        if (esCliente) {
            baseDeDatos.clientes.push(nuevaPersona);
        } else {
            baseDeDatos.noClientes.push(nuevaPersona);
        }

        // Guardar la base de datos en localStorage
        localStorage.setItem("baseDeDatos", JSON.stringify(baseDeDatos));
        return nuevaPersona;
    }

    // Función para cambiar de página
    function cambiarPagina(pagina) {
        document.querySelectorAll("section.container").forEach((section) => {
            section.style.display = "none";
        });

        // Mostrar la página seleccionada
        const paginaSeleccionada = document.getElementById(pagina);
        if (paginaSeleccionada) {
            paginaSeleccionada.style.display = "block";
        } else {
            console.error(`No se encontró la página con ID: ${pagina}`);
        }
        document.getElementById(pagina).style.display = "block";
    }

    // Manejar el clic en el botón de búsqueda
    buscarDNIButton.addEventListener("click", function () {
        const dni = dniInput.value.trim();

        // Validar el DNI
        if (!validarDNI(dni)) {
            mensajeError.textContent = "Por favor, ingrese un DNI válido (8 dígitos numéricos).";
            mensajeError.style.display = "block";
            return;
        }

        // Obtener la opción seleccionada (cliente o no cliente)
        const esCliente = localStorage.getItem("esCliente") === "true";

        // Buscar el DNI en la base de datos
        let persona = buscarDNI(dni);

        if (persona) {
            // Verificar si el DNI está en el arreglo correcto
            if (esCliente && !persona.esCliente) {
                mensajeError.textContent = "El DNI ingresado corresponde a un no cliente. Seleccione 'No tengo una cuenta'.";
                mensajeError.style.display = "block";
                return;
            } else if (!esCliente && persona.esCliente) {
                mensajeError.textContent = "El DNI ingresado corresponde a un cliente. Seleccione 'Ya tengo una cuenta'.";
                mensajeError.style.display = "block";
                return;
            }
        } else {
            // Si el DNI no se encuentra, crear una nueva persona
            persona = agregarPersona(dni, esCliente);
        }

        // Guardar la información de la persona en localStorage para usarla en la página 3
        localStorage.setItem("personaActual", JSON.stringify(persona));

        // Redirigir a la página 3
        cambiarPagina("page3");
    });

    // Función para seleccionar la opción (cliente o no cliente)
    window.seleccionarOpcion = function (esCliente) {
        // Guardar la opción seleccionada en localStorage
        localStorage.setItem("esCliente", esCliente);

        // Redirigir a la página de ingreso de DNI
        cambiarPagina("page2");
    };

    function seleccionarOpcion(esCliente) {
        localStorage.setItem("esCliente", esCliente);
        cambiarPagina("page2");
    }    
});