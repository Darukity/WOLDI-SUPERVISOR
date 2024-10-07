const { SlashCommandBuilder } = require('discord.js');
const ping = require('ping');

const fs = require('fs');

const computers_manager = require('./computer_data/computers_manager');

const path = './commands/computer/computer_data/computers.json';

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

        const ip = computers_manager.getIpByName(name);
        if (ip === null) {
            await interaction.reply('Computer not found');
            return;
        }

        try {
            const res = await ping.promise.probe(ip);
            if (res.alive) {
                await interaction.reply('Computer is alive');
            } else {
                await interaction.reply('Computer is not alive');
            }
        } catch (err) {
            await interaction.reply('Error');
        }
	},
};
