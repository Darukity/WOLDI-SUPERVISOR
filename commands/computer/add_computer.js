// {
//     "name": "Computer 1",
//     "ip": "",
//     "mac": "",
//     "bot_port": ""
// }

// example of computers.json
// {
//     "computers": [
//         {
//             "name": "Computer 1",
//             "ip": "",
//             "mac": "",
//             "bot_port": ""
//         }
//     ]
// }

// TODO: add PC_TYPE and PC_USERNAME to the computer object for shut command

const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const computers_manager = require('./computer_data/computers_manager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcomputer')
		.setDescription('Add a computer to the database')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the computer')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('The ip of the computer')
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName('mac')
                .setDescription('The mac of the computer')
                .setRequired(true)
            ),

	async execute(interaction, client) {
        const name = interaction.options.getString('name');
        const ip = interaction.options.getString('ip');
        const mac = interaction.options.getString('mac');;
        await interaction.reply(computers_manager.addComputer(name, ip, mac));
	},
};