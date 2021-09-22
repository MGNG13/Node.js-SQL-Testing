//////////////////////////////////////////////////////
// Ejemplo de server - Lectura y mostrado de datos v1
//////////////////////////////////////////////////////
// Library from NodeJs
const http = require('http');
const fs = require('fs');

// Server Connection Settings
const host = '192.168.1.70';
const port = 3000;

// Get time
function showTime() {
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59
    let session = "A.M.";
    if (h == 0) {
        h = 12;
    }
    if (h > 12) {
        h = h - 12;
        session = "P.M.";
    }
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    let time = h + ":" + m + ":" + s + " " + session;
    setTimeout(showTime, 1000);
    return time;
}

// Get IP Adress
function WhatsMyIpAddress(callback) {
    const options = {
        host: 'ipv4bot.whatismyipaddress.com',
        port: 80,
        path: '/'
    };
    http.get(options, res => {
        res.setEncoding('utf8');
        res.on("data", chunk => callback(chunk, null));
    }).on('error', err => callback(null, err.message));
}

// Variable server and connection
const server = http.createServer((req, res) => {
    if (req.url === '/ip') {
        WhatsMyIpAddress((data, error) => {
            let ip = data + '\n' + showTime();
            let err = error + '\n' + showTime();
            if (error != null) {
                res.writeHead(404, { 'Content-Type': 'text/plane' });
                res.end("Error: " + err);
                console.log('\nError al obtener la ip ', err);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plane' });
                res.end('Tu IP pulica es ' + ip);
                console.log("\nIP entrante " + ip);
            }
        });
    } else if (req.url === '/'){
        res.writeHead(200, { 'Content-Type': 'text/plane' });
        res.end('Bienvenido a mi primer servidor!\n\n\nPuedes usar   =>    ' + host + ':' + port +'/ip        Para obtener tu IP.\n\n\n\nSaludos!');
        WhatsMyIpAddress((data, error) => {
            let ip = data + '\n' + showTime();
            let err = error + '\n' + showTime();
            if (error != null) {
                console.log('\nError index ' + err);
            } else {
                console.log('\nUsuario dentro de index con la ip ' + ip);
            }
        });
    } else {
        res.writeHead(404);
        res.end('Error 404, URL no encontrada en el server\n\n'+req.url);
        WhatsMyIpAddress((data, error) => {
            let ip = data + '\n' + showTime();
            let err = error + '\n' + showTime();
            if (error != null) {
                console.log('\nError URL & IP - Testing ' + err);
            } else {
                console.log('\nError URL - Testing ' + ip);
            }
        });
    }
});

// Show connection successfuly in console
server.listen(port, host, () => {
    console.log('\n\nServidor funcionando en la direccion   =>  ' + host + ':' + port + '\nHora de Inicio   =>  ' + showTime() + '\n\n');
});