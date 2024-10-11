# This project
The goal of WOLDI (Wake On LAN Discord Interface) is to create a way to wake up any PC within the network of the machine running WOLDI-SUPERVISOR.

# Features

## Finished Commands

- **/addcomputer**
: Add a new computer to the list by specifying its name, IP address, and MAC address.

    This command allows you to register a new computer in the system, making it available for other commands such as wake, shut, and ping.

    To use this feature, provide the necessary details like the computer's name, IP address, and MAC address.

- **/associatebottocomputer**: Associate a bot to a computer using the bot's token, bot ID, server ID, and computer name.

    You can link another Discord bot to a specific PC to display real-time info such as offline or online status, and how much time the computer has spent online.

    To know how to use this feature, refer to the "How to associate a bot to a computer" section.

- **/pingcomputer**: Ping a computer by specifying its name.
- **/changestatus**: Change the status of the bot associated with a PC to whatever you want to test.
- **/computerlist**: List all added computers with their details such as IP, MAC address, and assignment status.
- **/wake**: Wake up a computer by specifying its name.

    This command sends a Wake-on-LAN (WoL) packet to the specified computer, allowing it to be powered on remotely.

    To use this feature, ensure that the target computer supports WoL and is configured correctly.

## Pending/In Development Commands

- **/shut**: Shut down a computer by specifying its name.

    This command sends a shutdown signal to the specified computer, allowing it to be powered off remotely.

    To use this feature, ensure that the target computer supports remote shutdown and is configured correctly.

- **/streek**: Get the current streak of a computer (returns last seen if offline).
- **/restaure**: Restore all containers that could be off after an electricity shutdown.
- **/routine**: Start and stop routines for a PC (like wake up at 8 AM and shut down at 10 PM).

## Carousel status of the supervisor

The supervisor has a status that changes eatch 10 seconds showing how many computers are on, how many are in the database, and how many of them are associated.

![Carousel status of the supervisor](https://github.com/Darukity/WOLDI-SUPERVISOR/blob/master/readme_img/2.gif?raw=true "Carousel status of the supervisor")

## Carousel status of slaves bots

The status of the slaves bots show how mutch time the pc was alive and show "offline" when the pc is down.

The state of the bot is also going from online when the pc is on and do not disturb when he is offline.

![Carousel status of the slaves bot](https://github.com/Darukity/WOLDI-SUPERVISOR/blob/master/readme_img/1.gif?raw=true "Carousel status of the slaves bot")

# How to associate a bot to a computer

## Prerequirements
1. You need to have docker installed on the machine youre running the program onto
2. go to https://github.com/Darukity/WOLDI-SUPERVISOR.git download or clone the project in SL folder sutch as the tree look like this

    ```
    tree -L 2
    .
    ├── commands
    │   ├── computer
    │   ├── scheduled_tasks
    │   ├── test
    │   └── utility
    ├── Dockerfile
    ├── lunch.bat
    ├── node_modules
            .
            .
            .
    ├── package.json
    ├── package-lock.json
    ├── refresh-commands.js
    ├── SL
    │   ├── commands
    │   ├── node_modules
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── README.md
    │   ├── refresh-commands.js
    │   └── slave.js
    └── supervisor.js
    ```
3. When you did that you will now be able to use the `/associatebottocomputer` command with `/associatebottocomputer token: <The token of the new bot> bot_id: <the id of new bot> server_id: <the id of the server> pc_name: <pc name (chose from the list only)>`