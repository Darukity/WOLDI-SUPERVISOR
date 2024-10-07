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

const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

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
        const path = 'commands/computer/computer_data/computers.json';
        const data = JSON.parse(fs.readFileSync(path));
        data.computers.push({
            "name": name,
            "ip": ip,
            "mac": mac,
            "bot_port": ""
        });
        fs.writeFileSync(path, JSON.stringify(data));
        await interaction.reply('Computer added to the database');
	},
};