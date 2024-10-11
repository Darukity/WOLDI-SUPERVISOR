// sheduled_data.json example:
// {
//     "computers": [
//         {
//             "name": "Uranus",
//             "best_streak": 0,
//             "current_streak": 0,
//             "is_in_best_streak": false,
//             "last_seen": ""
//             "is_alive": false
//         }
//     ]
// }

const path = 'commands/scheduled_tasks/scheduled_data/scheduled_data.json';
const fs = require('node:fs');

function formatComputerSchedule(name) {
    return {
        name: name,
        best_streak: 0,
        current_streak: 0,
        is_in_best_streak: false,
        last_seen: "",
        is_alive: false
    };
}

function getAllComputers() {
    return JSON.parse(fs.readFileSync(path));
}

// updateAllComputers to be the right format if they are not
function updateAllComputers() {
    const data = getAllComputers();
    const defaultComputer = formatComputerSchedule('');
    for (let i = 0; i < data.computers.length; i++) {
        data.computers[i] = { ...defaultComputer, ...data.computers[i] };
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function addCompueterToSheduled(name) {
    const data = getAllComputers();
    data.computers.push(formatComputerSchedule(name));
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function getComputerByName(name) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            return data.computers[i];
        }
    }
    return null;
}

function updateBestStreak(name, best_streak) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].best_streak = best_streak;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return;
        }
    }
}

function updateCurrentStreak(name, current_streak) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].current_streak = current_streak;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return;
        }
    }
}

function setIsInBestStreak(name, is_in_best_streak) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].is_in_best_streak = is_in_best_streak;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return;
        }
    }
}

function updateLastSeen(name, last_seen) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].last_seen = last_seen;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return;
        }
    }
}

function getIsAlive(name) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            return data.computers[i].is_alive;
        }
    }
    return false;
}

function updateIsAlive(name, is_alive) {
    const data = getAllComputers();
    for (let i = 0; i < data.computers.length; i++) {
        if (data.computers[i].name === name) {
            data.computers[i].is_alive = is_alive;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return;
        }
    }
}

// Call updateAllComputers to update all computers to the correct format at the start
updateAllComputers();

module.exports = {
    getAllComputers,
    addCompueterToSheduled,
    getComputerByName,
    updateBestStreak,
    updateCurrentStreak,
    setIsInBestStreak,
    updateLastSeen,
    getIsAlive,
    updateIsAlive
};