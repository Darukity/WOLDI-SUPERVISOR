const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const computers_manager = require('./computer_data/computers_manager');

const path = './commands/computer/computer_data/computers.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removecomputer')
		.setDescription('removes a computer to the database')
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

        await interaction.reply(computers_manager.removeComputer(name));
    },
};
