const { SlashCommandBuilder } = require('discord.js');
const ping = require('ping');

const fs = require('fs');

const path = 'commands/computer/computer_data/computers.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingcomputer')
		.setDescription('Ping a computer')
        .addStringOption(option =>
            option.setName('pc_name')
                .setDescription('Votre choix')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [];

        const data = JSON.parse(fs.readFileSync(path));
        for (let i = 0; i < data.computers.length; i++) {
            choices.push(data.computers[i].name);
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

	async execute(interaction, client) {
        const name = interaction.options.getString('pc_name');

        const data = JSON.parse(fs.readFileSync(path));

        let ip = "";

        for (let i = 0; i < data.computers.length; i++) {
            if (data.computers[i].name === name) {
                ip = data.computers[i].ip;
                break;
            }
        }

        try {
            await ping.promise.probe(ip);
            await interaction.reply('This computer is online');
        } catch (error) {
            await interaction.reply('This computer is not offline');
            return;
        }        
	},
};
