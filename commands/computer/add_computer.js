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
        for (let i = 0; i < data.computers.length; i++) {
            if (data.computers[i].name === name) {
                await interaction.reply('This computer already exists in the database');
                return;
            }
            if (data.computers[i].ip === ip) {
                await interaction.reply('This ip already exists in the database');
                return;
            }
            if (data.computers[i].mac === mac) {
                await interaction.reply('This mac already exists in the database');
                return;
            }
        }
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