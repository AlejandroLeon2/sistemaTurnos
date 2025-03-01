let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let noClientes = JSON.parse(localStorage.getItem('noClientes')) || [];
let queues = JSON.parse(localStorage.getItem('queues')) || { CG: [], SC: [], CR: [], G: [] };
let counters = JSON.parse(localStorage.getItem('counters')) || { CG: 0, SC: 0, CR: 0, G: 0 };
        
function generateRandomClients() {
    if (clientes.length === 0) {
        for (let i = 0; i < 100; i++) {
            let dni = Math.floor(10000000 + Math.random() * 90000000).toString();
            let nombre = "Cliente " + (i + 1);
            let correo = `cliente${i + 1}@correo.com`;
            let edad = Math.floor(18 + Math.random() * 50);
            clientes.push({ dni, nombre, correo, edad });
        }
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }
}

function generateRandomNoClients() {
    if (noClientes.length === 0) {
        for (let i = 0; i < 100; i++) {
            let dni = Math.floor(10000000 + Math.random() * 90000000).toString();
            let nombre = "Cliente " + (i + 1);
            let correo = `noCliente${i + 1}@correo.com`;
            let edad = Math.floor(18 + Math.random() * 50);
            clientes.push({ dni, nombre, correo, edad });
        }
        localStorage.setItem('noClientes', JSON.stringify(noClientes));
    }
}
        
generateRandomClients();
        
function showSection(sectionId) {
    document.querySelectorAll('.content > div').forEach(div => div.classList.add('d-none'));
    document.getElementById(sectionId).classList.remove('d-none');
    if (sectionId === 'esperaSection') loadEspera();
}
        
function validateDNI() {
    let dniInput = document.getElementById('dniInput');
    let dni = dniInput.value;
    let clientesDB = JSON.parse(localStorage.getItem('clientes')) || [];
    let cliente = clientesDB.find(c => c.dni === dni);
    if (cliente) {
        alert(`Bienvenido, ${cliente.nombre}`);
    } else {
        alert("DNI no registrado, será ingresado como nuevo cliente.");
        let nuevoCliente = { dni, nombre: `Usuario ${dni}`, correo: "", edad: 18 };
        clientesDB.push(nuevoCliente);
        localStorage.setItem('noClientes', JSON.stringify(clientesDB));
    }
    dniInput.value = "";
    showSection('serviceSection');
}
        
function assignQueue(service) {
    let dni = document.getElementById('dniInput').value;
    let clientesDB = JSON.parse(localStorage.getItem('clientes')) || [];
    let cliente = clientesDB.find(c => c.dni === dni) || { nombre: "Usuario " + dni };
    let numero = ++counters[service];
    let codigo = `${service} ${String(numero).padStart(3, '0')}`;
    let userData = { dni, nombre: cliente.nombre, codigo };
            
    queues[service].push(userData);
    localStorage.setItem('queues', JSON.stringify(queues));
    localStorage.setItem('counters', JSON.stringify(counters));
    alert('Ticket generado: ' + codigo);
}
        
function loadEspera() {
    let esperaLista = document.getElementById('esperaLista');
    esperaLista.innerHTML = '';
            
    let allQueues = [].concat(...Object.values(queues));
    allQueues.forEach(user => {
        let li = document.createElement('li');
        li.className = "list-group-item";
        li.textContent = `${user.codigo} - ${user.nombre}`;
        esperaLista.appendChild(li);
    });
}