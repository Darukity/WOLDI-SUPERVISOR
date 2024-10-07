const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('fs');

const computers_manager = require('./computer_data/computers_manager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('computerlist')
        .setDescription('List all computers'),
    async execute(interaction, client) {

        const fields = computers_manager.getComputerList();
        const embed = new EmbedBuilder()
            .setTitle('List of computers')
            .setDescription('Here is the list of all computers')
            .setTimestamp()
            .setFields(fields);
        await interaction.reply({ embeds: [embed] });
    },

};
