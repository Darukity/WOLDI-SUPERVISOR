// Periodically ping all computers to check if they are alive
// Count up the time that one computer is alive

// sheduled_data.json example:
// {
//     "computers": [
//         {
//             "name": "Uranus",
//             "best_streak": 0,
//             "current_streak": 0,
//             "is_in_best_streak": false,
//             "last_seen": ""
//         }
//     ]
// }

const ping = require('ping');

const { io } = require('socket.io-client');

const computers_manager = require('../computer/computer_data/computers_manager');
const sheduled_data_manager = require('./sheduled_data/sheduled_data_manager.js');
/* available functions from sheduled_data_manager.js
    getAllComputers,
    addCompueterToSheduled,
    getComputerByName,
    updateBestStreak,
    updateCurrentStreak,
    setIsInBestStreak,
    updateLastSeen
*/

const { ActivityType } = require('discord.js');

let computers_alive = [];

function start(client) {
    carouselStatusSupervisor(client);
    carouselStatusSlave();
    pingComputers();
    updateCurrentStreaks();
    announceBestStreaks();
    checkIfComputerIsAlive();
    //sendLogTest();
}

// for Supervisor
function carouselStatusSupervisor(client) {
    var status = false;
    setInterval(async () => {
        const asociated_computers = computers_manager.getAllAsociatedComputers();
        const computers = computers_manager.getAllComputers();

        // console.log(`Computers: ${computers.length} - Asociated computers: ${asociated_computers.length}`);

        if (status) {
            client.user.setActivity(`${computers.length} computers and ${asociated_computers.length} asociated computers`, { type: ActivityType.Watching });
            status = false;
        } else {
            client.user.setActivity(`${computers_alive.length} computers alive`, { type: ActivityType.Listening });
            status = true;
        }
        
    }, 10000);
}

// for slaves
function carouselStatusSlave() {
    //for all asociated computers set the status to the current streak if the computer is alive
    setInterval(async () => {
        const computers = computers_manager.getAllAsociatedComputers();
        const data = sheduled_data_manager.getAllComputers();
        // for each computer
        for (let i = 0; i < computers.length; i++) {
            // if the computer is in the computers_alive array
            if (computers_alive.includes(computers[i].name)) {
                // get the current streak of the computer
                const current_streak = sheduled_data_manager.getComputerByName(computers[i].name).current_streak;
                // set the status of the computer to the current streak
                const socket = io(`http://localhost:${computers[i].bot_port}`);
                socket.emit('newStatus', `Current streak: ${convertSecondsToTime(current_streak)}`, 'Playing', () => {
                    socket.disconnect();
                    socket.close();
                });
            } else {
                // if the computer is not in the computers_alive array, set the status to "Offline"
                const socket = io(`http://localhost:${computers[i].bot_port}`);
                socket.emit('newStatus', 'Offline', 'Watching', () => {
                    socket.disconnect();
                    socket.close();
                });
            }
        }
    }
    , 10000);
}


// Periodically ping all computers to check if they are alive
function pingComputers() {
    setInterval(async () => {
        const computers = computers_manager.getAllComputers();
        // ping all computers and add them to the computers_alive array
        computers.forEach(computer => {
            ping.sys.probe(computer.ip, function(isAlive) {
                if (isAlive) {
                    if (!computers_alive.includes(computer.name)) {
                        computers_alive.push(computer.name);
                        sheduled_data_manager.updateLastSeen(computer.name, new Date().toISOString());
                        // setPresenceStatus of the computer if it is asociated and alive
                        if (computers_manager.getComputerByName(computer.name).bot_port !== "") {
                            const socket = io(`http://localhost:${computers_manager.getComputerByName(computer.name).bot_port}`);
                            socket.emit('setPresenceStatus', 'Online', () => {
                                socket.disconnect();
                                socket.close();
                            });
                        }
                        
                    }
                } else {
                    if (computers_alive.includes(computer.name)) {
                        computers_alive = computers_alive.filter(name => name !== computer.name)
                        // setPresenceStatus of the computer if it is asociated and not alive
                        if (computers_manager.getComputerByName(computer.name).bot_port !== "") {
                            const socket = io(`http://localhost:${computers_manager.getComputerByName(computer.name).bot_port}`);
                            socket.emit('setPresenceStatus', 'DoNotDisturb', () => {
                                socket.disconnect();
                                socket.close();
                            });
                        }
                    }
                }
            });
        });
    }, 10000);
}

// Update the current_streak with a time for all computers if they are in computer_alive array
// if they are not in the array, set the current_streak to 0
// if the computer is not in in sheduled_data.json, add it
function updateCurrentStreaks() {
    setInterval(async () => {
        const computers = computers_manager.getAllComputers();
        const data = sheduled_data_manager.getAllComputers();
        // for each computer
        for (let i = 0; i < computers.length; i++) {
            // if the computer is in the computers_alive array
            if (computers_alive.includes(computers[i].name)) {
                // if the computer is not in the sheduled_data.json, add it
                if (sheduled_data_manager.getComputerByName(computers[i].name) === null) {
                    sheduled_data_manager.addCompueterToSheduled(computers[i].name);
                }
                // get the current streak of the computer
                const current_streak = sheduled_data_manager.getComputerByName(computers[i].name).current_streak;
                // update the current streak
                sheduled_data_manager.updateCurrentStreak(computers[i].name, current_streak + 1);

                if (current_streak + 1 > sheduled_data_manager.getComputerByName(computers[i].name).best_streak) {
                    sheduled_data_manager.updateBestStreak(computers[i].name, current_streak + 1);
                    sheduled_data_manager.setIsInBestStreak(computers[i].name, true);
                }
            } else {
                // if the computer is not in the computers_alive array, set the current streak to 0
                sheduled_data_manager.updateCurrentStreak(computers[i].name, 0);
            }
        }
    }
    , 1000);
}

// Announce the best streak of all computers one time if the computer is in the best streak
let is_in_best_streak = [];

function announceBestStreaks() {
    setInterval(async () => {
        const data = sheduled_data_manager.getAllComputers();
        // for each computer
        for (let i = 0; i < data.computers.length; i++) {
            // if the computer is in the best streak
            if (data.computers[i].is_in_best_streak && !is_in_best_streak.includes(data.computers[i].name)) {
                // announce the best streak
                const name = data.computers[i].name;
                console.log(`http://localhost:${computers_manager.getComputerByName(name).bot_port}`);
                const socket = io(`http://localhost:${computers_manager.getComputerByName(name).bot_port}`);
                socket.emit('log', `${name} has beaten his uptime streak that was: ${convertSecondsToTime(data.computers[i].best_streak)}`, () => {
                    socket.disconnect();
                    socket.close();
                });
                is_in_best_streak.push(data.computers[i].name);
            }
        }
    }, 1000);
}

// Use the computers_alive_copy array to check if a computer was alive in the last 10 seconds
// if it was, and is_in_best_streak to true update the is_in_best_streak to false and remove the computer from the is_in_best_streak array
// Announce that the computer has shut down

let computers_alive_copy = computers_alive;
function checkIfComputerIsAlive() {
    setInterval(async () => {
        // for each computer in the is_in_best_streak array
        for (let i = 0; i < is_in_best_streak.length; i++) {
            // if the computer is not in the computers_alive_copy array
            if (!computers_alive_copy.includes(is_in_best_streak[i])) {
                // set the is_in_best_streak to false
                sheduled_data_manager.setIsInBestStreak(is_in_best_streak[i], false);
                // announce that the computer has shut down
                const socket = io(`http://localhost:${computers_manager.getComputerByName(is_in_best_streak[i]).bot_port}`);
                socket.emit('log', `${is_in_best_streak[i]} has shut down`, () => {
                    socket.disconnect();
                    socket.close();
                });
                // remove the computer from the is_in_best_streak array
                is_in_best_streak = is_in_best_streak.filter(name => name !== is_in_best_streak[i]);
            }
        }
        // update the computers_alive_copy array
        computers_alive_copy = computers_alive;
    }, 10000);
}


function convertSecondsToTime(seconds) {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor((seconds % (3600 * 24)) / 3600)
    var m = Math.floor((seconds % 3600) / 60)
    var s = Math.floor(seconds % 60)
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
    return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`
  }

// Send a test log to all asociated computers
function sendLogTest() {
    setInterval(async () => {
        // get all associated computers
        const computers = computers_manager.getAllAsociatedComputers();
        // for each computer
        for (let i = 0; i < computers.length; i++) {
            // get the port
            const port = computers[i].bot_port;
            // connect with socket.io, send socket.emit('log', 'Test log'), then disconnect
            console.log(`http://localhost:${port}`);

            const socket = io(`http://localhost:${port}`);
            socket.emit('log', 'Test log', () => {
                socket.disconnect();
                socket.close();
            });
        }        
    }, 10000);
}

module.exports = {
    start
};