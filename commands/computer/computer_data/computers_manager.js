const fs = require('fs');

const path = 'commands/computer/computer_data/computers.json';

function get_computers() {
    return JSON.parse(fs.readFileSync(path));
}

function getComputerByName(name) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            return data.computers[i];
        }
    }
    return null;
}

function getComputerByIp(ip) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].ip === ip) {
            return data.computers[i];
        }
    }
    return null;
}

function getIpByName(name) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {  
            return data.computers[i].ip;
        }
    }
    return null;
}

function getComputerByMac(mac) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].mac === mac) {
            return data.computers[i];
        }
    }
    return null;
}

function getPortList() {
    const data = get_computers();
    const ports = [];
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].bot_port !== "") {
            ports.push(data.computers[i].bot_port);
        }
    }
    return ports;
}

function addComputer(name, ip, mac) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            return 'This computer already exists in the database';
        }
        if (data.computers[i].ip === ip) {
            return 'This ip already exists in the database';
        }
        if (data.computers[i].mac === mac) {
            return 'This mac already exists in the database';
        }
    }
    data.computers.push({
        name: name,
        ip: ip,
        mac: mac,
        bot_port: ""
    });
    fs.writeFileSync(path, JSON.stringify(data));
    return 'Computer added to the database';
}

function removeComputer(name) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers.splice(i, 1);
            fs.writeFileSync(path, JSON.stringify(data));
            return 'Computer removed';
        }
    }
    return 'This computer does not exist in the database';
}

function getComputerList() {
    const data = get_computers();
    if (data.computers.length === 0) {
        return 'No computer in the database';
    }
    let message = [];
    for (let i = 0; i < data.computers.length; i++) {
        
        message.push({name: data.computers[i].name, value: `IP: ${data.computers[i].ip}\nMAC: ${data.computers[i].mac}\nAsigned: ${data.computers[i].bot_port?`Yes (${data.computers[i].bot_port})`:'No'}`});
    }
    return message;
}

function updatePort(name, port) {
    const data = get_computers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].bot_port = port;
            fs.writeFileSync(path, JSON.stringify(data));
            return 'Port updated';
        }
    }
    return null;
}

module.exports = {
    get_computers,
    getComputerByName,
    getComputerByIp,
    getIpByName,
    getComputerByMac,
    getPortList,
    addComputer,
    removeComputer,
    getComputerList,
    updatePort
};