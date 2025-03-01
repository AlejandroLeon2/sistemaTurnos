const fs = require('fs'); // Módulo para manejar archivos

// Función para generar un DNI aleatorio de 8 dígitos
function generarDNI() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Función para generar un nombre aleatorio
function generarNombre() {
    const nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Laura", "Pedro", "Sofía"];
    const apellidos = ["Pérez", "García", "López", "Martínez", "González", "Rodríguez", "Fernández"];
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombre} ${apellido}`;
}

// Función para generar un correo electrónico aleatorio
function generarCorreo(nombre) {
    const dominios = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"];
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];
    return `${nombre.toLowerCase().replace(/\s/g, '')}@${dominio}`;
}

// Función para generar una edad aleatoria entre 18 y 99 años
function generarEdad() {
    return Math.floor(Math.random() * (99 - 18 + 1)) + 18;
}

// Función para determinar si una persona es cliente o no (50% de probabilidad)
function esCliente() {
    return Math.random() < 0.7; // 70% de probabilidad de ser cliente
}

// Función para generar una persona
function generarPersona() {
    const nombre = generarNombre();
    return {
        dni: generarDNI(), // DNI aleatorio
        nombre: nombre, // Nombre aleatorio
        correo: generarCorreo(nombre), // Correo aleatorio basado en el nombre
        edad: generarEdad() // Edad aleatoria
    };
}

// Arreglos para clientes y no clientes
const clientes = [];
const noClientes = [];

// Generar 1000 personas y clasificarlas
for (let i = 0; i < 1000; i++) {
    const persona = generarPersona();
    if (esCliente()) {
        clientes.push(persona); // Agregar a clientes
    } else {
        noClientes.push(persona); // Agregar a no clientes
    }
}

// Crear la estructura de la base de datos
const baseDeDatos = {
    clientes: clientes, // Arreglo de clientes
    noClientes: noClientes // Arreglo de no clientes
};

// Guardar la base de datos en un archivo JSON
fs.writeFileSync('baseDeDatos.json', JSON.stringify(baseDeDatos, null, 4), 'utf-8');

console.log('Base de datos creada y guardada en "baseDeDatos.json"');