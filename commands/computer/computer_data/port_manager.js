// singleton
const port = {
    port : 3003
}

function getPort(){
    return port.port;
}

function newPort(){
    port.port++;
    return port.port;
}

module.exports = {
    getPort,
    newPort
}