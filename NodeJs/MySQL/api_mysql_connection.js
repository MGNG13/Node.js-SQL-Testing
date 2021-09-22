////////////////////////////////
// Ejemplo de server - GET, POST
////////////////////////////////
const mysql = require('mysql');
const http = require('http');
const express = require('express');
const myconn = require('express-myconnection');
const mySqlconnectionSettings = {
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
}
const connection = mysql.createConnection(mySqlconnectionSettings);
const app = express();
const port = 3000;
// Get time - SERVER EXTRA DATA
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
// Get IP Adress - SERVER EXTRA DATA
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
// Restart connection with MySQL - ON ERROR REQUEST
function restartConnMYSQL() {
    connection.connect(function(error) {
        if (error) {
            setTimeout(restartConnMYSQL, 2000);
        }
    });
    connection.on('error', function(err) {
        if (err.code === 'ECONNRESET') {
            setTimeout(restartConnMYSQL, 2000);
        } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            setTimeout(restartConnMYSQL, 2000);
        } else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            setTimeout(restartConnMYSQL, 2000);
        } else {
            console.log('Fatal error connection MySQL: ' + err);
        }
    });
}




//////////////////////////////// SERVER SECTION ////////////////////////////////
// API Configuration - Get Params from URI
app.use(myconn(mysql, mySqlconnectionSettings, 'single'));
// Acept JSON request format
app.use(express.json());
// OnStart API - Show in console
app.listen(port, () => {
    WhatsMyIpAddress((data, error) => {
        if (error != null) {
            const err = error + ' - ' + showTime();
            console.log('\n\nServidor iniciado exitosamente!\nhttp://localhost:' + port + '\nIP SERVER:' + err + '\n');
        } else {
            const ip = data + ' - ' + showTime();
            console.log('\n\nServidor iniciado exitosamente!\nhttp://localhost:' + port + '\nIP SERVER:' + "IP PRIVADA" + '\n');
        }
    });
});

//////////////////////////////// INDEX SECTION ////////////////////////////////
// Index API - Send Hi to Request
const hiServer = 'API MySQL Version 1.2.5';
//
const resResult = new Object();
resResult.message = hiServer;
resResult.success = true;
resResult.error = 'null';
resResult.extradata = hiServer;
const dataResult = resResult;
//
app.get('/', (req, res) => {
    res.send(dataResult.extradata);
});
app.post('/', (req, res) => {
    res.send(dataResult.extradata);
});

//////////////////////////////// GET SECTION ////////////////////////////////
// ID
app.get('/id/:id', (req, res) => {
    req.getConnection((error, conn) => {
        if (error != null) {
            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
            const resResult = new Object();
            resResult.message = 'Error';
            resResult.success = false;
            resResult.error = 'Error al establecer la conexión con MySQL';
            resResult.extradata = error;
            const dataResult = resResult;
            res.send(dataResult);
            restartConnMYSQL();
        } else {
            let parameterGlobal = [req.params.id];
            if (connection.state === 'disconnected') {
                connection.connect(function(error) {
                    try {
                        if (error) {
                            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                            const resResult = new Object();
                            resResult.message = 'Error';
                            resResult.success = false;
                            resResult.error = 'Error al establecer la conexión con MySQL';
                            resResult.extradata = error;
                            const dataResult = resResult;
                            res.send(dataResult);
                            restartConnMYSQL();
                        } else {
                            console.log("\n------Response Success------\nConexión exitosa con MySQL!\nConexion ID: " + connection.threadId + '\n');
                            connection.query('SELECT * FROM nodejs WHERE id = ' + parameterGlobal + ';', function(error, results) {
                                if (error) {
                                    console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                                    const resResult = new Object();
                                    resResult.message = 'Error';
                                    resResult.success = false;
                                    resResult.error = 'Error al establecer la conexión con MySQL';
                                    resResult.extradata = error;
                                    const dataResult = resResult;
                                    res.send(dataResult);
                                    restartConnMYSQL();
                                } else {
                                    if (results.length === 0) {
                                        const resResult = new Object();
                                        resResult.message = 'null';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = 'null';
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        console.log('\n------Response NULL------\nID GET null ' + parameterGlobal);
                                    } else {
                                        const resResult = new Object();
                                        resResult.message = 'GET SUCCESS';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = results;
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        results.forEach(result => {
                                            console.log('\n------Request GET Success------');
                                            console.log(result);
                                        });
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        res.send(error);
                        restartConnMYSQL();
                    }
                });
            } else {
                console.log('\n\n========= Connection MySQL ID: ' + connection.threadId + ' =========');
                connection.query('SELECT * FROM nodejs WHERE id = ' + parameterGlobal + ';', function(error, results) {
                    if (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    } else {
                        if (results.length === 0) {
                            const resResult = new Object();
                            resResult.message = 'null';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = 'null';
                            const dataResult = resResult;
                            res.send(dataResult);
                            console.log('------Response NULL------\nID GET null ' + parameterGlobal);
                        } else {
                            const resResult = new Object();
                            resResult.message = 'GET SUCCESS';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = results;
                            const dataResult = resResult;
                            res.send(dataResult);
                            results.forEach(result => {
                                console.log('------Request GET Success------');
                                console.log(result);
                            });
                        }
                    }
                });
            }
        }
    });
});

// Nombre
app.get('/nombre/:nombre', (req, res) => {
    req.getConnection((error, conn) => {
        if (error != null) {
            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
            const resResult = new Object();
            resResult.message = 'Error';
            resResult.success = false;
            resResult.error = 'Error al establecer la conexión con MySQL';
            resResult.extradata = error;
            const dataResult = resResult;
            res.send(dataResult);
            restartConnMYSQL();
        } else {
            let parameterGlobal = [req.params.nombre];
            if (connection.state === 'disconnected') {
                connection.connect(function(error) {
                    try {
                        if (error) {
                            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                            const resResult = new Object();
                            resResult.message = 'Error';
                            resResult.success = false;
                            resResult.error = 'Error al establecer la conexión con MySQL';
                            resResult.extradata = error;
                            const dataResult = resResult;
                            res.send(dataResult);
                            restartConnMYSQL();
                        } else {
                            console.log("\n------Response Success------\nConexión exitosa con MySQL!\nConexion ID: " + connection.threadId + '\n');
                            connection.query('SELECT * FROM nodejs WHERE nombre LIKE "%' + parameterGlobal + '%";', function(error, results) {
                                if (error) {
                                    console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                                    const resResult = new Object();
                                    resResult.message = 'Error';
                                    resResult.success = false;
                                    resResult.error = 'Error al establecer la conexión con MySQL';
                                    resResult.extradata = error;
                                    const dataResult = resResult;
                                    res.send(dataResult);
                                    restartConnMYSQL();
                                } else {
                                    if (results.length === 0) {
                                        const resResult = new Object();
                                        resResult.message = 'null';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = 'null';
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        console.log('\n------Response NULL------\nNOMBRE GET null ' + parameterGlobal);
                                    } else {
                                        const resResult = new Object();
                                        resResult.message = 'GET SUCCESS';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = results;
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        results.forEach(result => {
                                            console.log('\n------Request GET Success------');
                                            console.log(result);
                                        });
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        res.send(error);
                        restartConnMYSQL();
                    }
                });
            } else {
                console.log('\n\n========= Connection MySQL ID: ' + connection.threadId + ' =========');
                connection.query('SELECT * FROM nodejs WHERE nombre LIKE "%' + parameterGlobal + '%";', function(error, results) {
                    if (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    } else {
                        if (results.length === 0) {
                            const resResult = new Object();
                            resResult.message = 'null';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = 'null';
                            const dataResult = resResult;
                            res.send(dataResult);
                            console.log('------Response NULL------\nNOMBRE GET null ' + parameterGlobal);
                        } else {
                            const resResult = new Object();
                            resResult.message = 'GET SUCCESS';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = results;
                            const dataResult = resResult;
                            res.send(dataResult);
                            results.forEach(result => {
                                console.log('------Request GET Success------');
                                console.log(result);
                            });
                        }
                    }
                });
            }
        }
    });
});

// Edad
app.get('/edad/:edad', (req, res) => {
    req.getConnection((error, conn) => {
        if (error != null) {
            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
            const resResult = new Object();
            resResult.message = 'Error';
            resResult.success = false;
            resResult.error = 'Error al establecer la conexión con MySQL';
            resResult.extradata = error;
            const dataResult = resResult;
            res.send(dataResult);
            restartConnMYSQL();
        } else {
            let parameterGlobal = [req.params.edad];
            if (connection.state === 'disconnected') {
                connection.connect(function(error) {
                    try {
                        if (error) {
                            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                            const resResult = new Object();
                            resResult.message = 'Error';
                            resResult.success = false;
                            resResult.error = 'Error al establecer la conexión con MySQL';
                            resResult.extradata = error;
                            const dataResult = resResult;
                            res.send(dataResult);
                            restartConnMYSQL();
                        } else {
                            console.log("\n------Response Success------\nConexión exitosa con MySQL!\nConexion ID: " + connection.threadId + '\n');
                            connection.query('SELECT * FROM nodejs WHERE edad = ' + parameterGlobal + ';', function(error, results) {
                                if (error) {
                                    console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                                    const resResult = new Object();
                                    resResult.message = 'Error';
                                    resResult.success = false;
                                    resResult.error = 'Error al establecer la conexión con MySQL';
                                    resResult.extradata = error;
                                    const dataResult = resResult;
                                    res.send(dataResult);
                                    restartConnMYSQL();
                                } else {
                                    if (results.length === 0) {
                                        const resResult = new Object();
                                        resResult.message = 'null';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = 'null';
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        console.log('\n------Response NULL------\nEDAD GET null ' + parameterGlobal);
                                    } else {
                                        const resResult = new Object();
                                        resResult.message = 'GET SUCCESS';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = results;
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        results.forEach(result => {
                                            console.log('\n------Request GET Success------');
                                            console.log(result);
                                        });
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        res.send(error);
                        restartConnMYSQL();
                    }
                });
            } else {
                console.log('\n\n========= Connection MySQL ID: ' + connection.threadId + ' =========');
                connection.query('SELECT * FROM nodejs WHERE edad = ' + parameterGlobal + ';', function(error, results) {
                    if (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    } else {
                        if (results.length === 0) {
                            const resResult = new Object();
                            resResult.message = 'null';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = 'null';
                            const dataResult = resResult;
                            res.send(dataResult);
                            console.log('------Response NULL------\nEDAD GET null ' + parameterGlobal);
                        } else {
                            const resResult = new Object();
                            resResult.message = 'GET SUCCESS';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = results;
                            const dataResult = resResult;
                            res.send(dataResult);
                            results.forEach(result => {
                                console.log('------Request GET Success------');
                                console.log(result);
                            });
                        }
                    }
                });
            }
        }
    });
});

// Todos los datos
app.get('/alldata', (req, res) => {
    req.getConnection((error, conn) => {
        if (error != null) {
            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
            const resResult = new Object();
            resResult.message = 'Error';
            resResult.success = false;
            resResult.error = 'Error al establecer la conexión con MySQL';
            resResult.extradata = error;
            const dataResult = resResult;
            res.send(dataResult);
            restartConnMYSQL();
        } else {
            if (connection.state === 'disconnected') {
                connection.connect(function(error) {
                    try {
                        if (error) {
                            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                            const resResult = new Object();
                            resResult.message = 'Error';
                            resResult.success = false;
                            resResult.error = 'Error al establecer la conexión con MySQL';
                            resResult.extradata = error;
                            const dataResult = resResult;
                            res.send(dataResult);
                            restartConnMYSQL();
                        } else {
                            console.log("\n------Response Success------\nConexión exitosa con MySQL!\nConexion ID: " + connection.threadId + '\n');
                            connection.query('SELECT * FROM nodejs;', function(error, results) {
                                if (error) {
                                    console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                                    const resResult = new Object();
                                    resResult.message = 'Error';
                                    resResult.success = false;
                                    resResult.error = 'Error al establecer la conexión con MySQL';
                                    resResult.extradata = error;
                                    const dataResult = resResult;
                                    res.send(dataResult);
                                    restartConnMYSQL();
                                } else {
                                    if (results.length === 0) {
                                        const resResult = new Object();
                                        resResult.message = 'null';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = 'null';
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        console.log('------Request GET null------');
                                    } else {
                                        console.log('------Request GET Success------');
                                        const resResult = new Object();
                                        resResult.message = 'GET SUCCESS';
                                        resResult.success = true;
                                        resResult.error = 'null';
                                        resResult.extradata = results;
                                        const dataResult = resResult;
                                        res.send(dataResult);
                                        results.forEach(result => {
                                            console.log(result);
                                        });
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        res.send(error);
                        restartConnMYSQL();
                    }
                });
            } else {
                console.log('\n\n========= Connection MySQL ID: ' + connection.threadId + ' =========');
                connection.query('SELECT * FROM nodejs;', function(error, results) {
                    if (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    } else {
                        if (results.length === 0) {
                            const resResult = new Object();
                            resResult.message = 'null';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = 'null';
                            const dataResult = resResult;
                            res.send(dataResult);
                            console.log('------Request GET null------');
                        } else {
                            console.log('------Request GET Success------');
                            const resResult = new Object();
                            resResult.message = 'GET SUCCESS';
                            resResult.success = true;
                            resResult.error = 'null';
                            resResult.extradata = results;
                            const dataResult = resResult;
                            res.send(dataResult);
                            results.forEach(result => {
                                console.log(result);
                            });
                        }
                    }
                });
            }
        }
    });
});

//////////////////////////////// POST SECTION ////////////////////////////////
// Post new user with nombre and edad - send ID from user saved
app.post('/new-user', (req, res) => {
    req.getConnection((error, conn) => {
        if (error != null) {
            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
            const resResult = new Object();
            resResult.message = 'Error';
            resResult.success = false;
            resResult.error = 'Error al establecer la conexión con MySQL';
            resResult.extradata = error;
            const dataResult = resResult;
            res.send(dataResult);
            restartConnMYSQL();
        } else {
            if (connection.state === 'disconnected') {
                connection.connect(function(error) {
                    try {
                        if (error) {
                            console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                            const resResult = new Object();
                            resResult.message = 'Error';
                            resResult.success = false;
                            resResult.error = 'Error al establecer la conexión con MySQL';
                            resResult.extradata = error;
                            const dataResult = resResult;
                            res.send(dataResult);
                            restartConnMYSQL();
                        } else {
                            console.log("\n------Response Success------\nConexión exitosa con MySQL!\nConexion ID: " + connection.threadId + '\n');
                            const nombre = [req.body.nombre];
                            const edad = [req.body.edad];
                            connection.query('INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ("' + nombre + '", "' + edad + '");', function(error) {
                                if (error) {
                                    console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                                    const resResult = new Object();
                                    resResult.message = 'Error';
                                    resResult.success = false;
                                    resResult.error = 'Error al establecer la conexión con MySQL';
                                    resResult.extradata = error;
                                    const dataResult = resResult;
                                    res.send(dataResult);
                                    restartConnMYSQL();
                                } else {
                                    // Success Added - GET USER ID
                                    connection.query('SELECT id FROM `nodejs` WHERE nombre LIKE "' + nombre + '" AND edad LIKE "' + edad + '";', function(error, data) {
                                        if (error) {
                                            const resResult = new Object();
                                            resResult.message = 'Successful added user!';
                                            resResult.success = true;
                                            resResult.error = 'Error getting ID';
                                            resResult.extradata = error;
                                            const dataResult = resResult;
                                            res.send(dataResult);
                                            console.log('\n------Response Success------\nSuccessful added user: ' + nombre + ' - ' + edad);
                                        } else {
                                            const resResult = new Object();
                                            resResult.message = 'Successful added user!';
                                            resResult.success = true;
                                            resResult.error = 'null';
                                            resResult.extradata = data[0].id;
                                            const dataResult = resResult;
                                            res.send(dataResult);
                                            console.log('\n------Response Success------\nSuccessful added user: ' + nombre + ' - ' + edad);
                                            console.log(dataResult);
                                        }
                                    });
                                }
                            });
                        }
                    } catch (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    }
                });
            } else {
                console.log('\n\n========= Connection MySQL ID: ' + connection.threadId + ' =========');
                const nombre = [req.body.nombre];
                const edad = [req.body.edad];
                connection.query('INSERT INTO `nodejs` (`nombre`, `edad`) VALUES ("' + nombre + '", "' + edad + '");', function(error) {
                    if (error) {
                        console.log("\n------Response ERROR------\nError al establecer la conexión con MySQL\n" + error);
                        const resResult = new Object();
                        resResult.message = 'Error';
                        resResult.success = false;
                        resResult.error = 'Error al establecer la conexión con MySQL';
                        resResult.extradata = error;
                        const dataResult = resResult;
                        res.send(dataResult);
                        restartConnMYSQL();
                    } else {
                        // Success Added - GET USER ID
                        connection.query('SELECT id FROM `nodejs` WHERE nombre LIKE "' + nombre + '" AND edad LIKE "' + edad + '";', function(error, data) {
                            if (error) {
                                const resResult = new Object();
                                resResult.message = 'Successful added user!';
                                resResult.success = true;
                                resResult.error = 'Error getting ID';
                                resResult.extradata = error;
                                const dataResult = resResult;
                                res.send(dataResult);
                                console.log('\n------Response Success------\nSuccessful added user: ' + nombre + ' - ' + edad);
                            } else {
                                const resResult = new Object();
                                resResult.message = 'Successful added user!';
                                resResult.success = true;
                                resResult.error = 'null';
                                resResult.extradata = data[0].id;
                                const dataResult = resResult;
                                res.send(dataResult);
                                console.log('\n------Response Success------\nSuccessful added user: ' + nombre + ' - ' + edad);
                                console.log(dataResult);
                            }
                        });
                    }
                });
            }
        }
    });
});

//////////////////////////////// NULL SECTION ////////////////////////////////
// Obtener /get/ idk-content - NULL RESPONSE
app.get('/:null', (req, res) => {
    const resResult = new Object();
    resResult.message = 'null';
    resResult.success = false;
    resResult.error = 'null';
    resResult.extradata = 'null';
    const dataResult = resResult;
    res.send(dataResult);
    console.log('\n------Response NULL------\nRequest null GET');
});

// Enviar /post/ idk-content - NULL RESPONSE
app.post('/:null', (req, res) => {
    const resResult = new Object();
    resResult.message = 'null';
    resResult.success = false;
    resResult.error = 'null';
    resResult.extradata = 'null';
    const dataResult = resResult;
    res.send(dataResult);
    console.log('\n------Response NULL------\nRequest null POST');
});

//////////////////////////////// CATCH SECTION ////////////////////////////////
// On server error - catch and restart connection API, SERVER DON'T STOP
process.on('uncaughtException', function(err) {
    let error = err + ' ';
    if (error === 'Error: read ECONNRESET ') {
        restartConnMYSQL();
    }
    console.log('\n\n----------------------------\n\nCatch error - SERVER: ' + err + '\n\n----------------------------\n\n');
});