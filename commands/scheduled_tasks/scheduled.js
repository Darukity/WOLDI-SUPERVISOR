// Periodically ping all associated computers to check if they are alive
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
const computers_manager = require('../computer/computer_data/computers_manager');

const { ActivityType } = require('discord.js');

let computers_alive = [];

function start(client) {
    carouselStatus(client);
    pingComputers();
}

function carouselStatus(client) {
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

function pingComputers() {
    setInterval(async () => {
        const computers = computers_manager.getAllComputers();
        // ping all computers and add them to the computers_alive array
        computers.forEach(computer => {
            ping.sys.probe(computer.ip, function(isAlive) {
                if (isAlive) {
                    if (!computers_alive.includes(computer.name)) {
                        computers_alive.push(computer.name);
                    }
                } else {
                    if (computers_alive.includes(computer.name)) {
                        computers_alive = computers_alive.filter(name => name !== computer.name);
                    }
                }
            });
        });
    }, 10000);
}



module.exports = {
    start
};