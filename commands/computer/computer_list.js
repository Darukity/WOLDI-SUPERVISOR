const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('fs');

const path = 'commands/computer/computer_data/computers.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('computerlist')
        .setDescription('List all computers'),
    async execute(interaction, client) {
        const data = JSON.parse(fs.readFileSync(path));
        if (data.computers.length === 0) {
            await interaction.reply('No computer in the database');
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle('List of computers');
            
        for (let i = 0; i < data.computers.length; i++) {
            embed.addFields({name: data.computers[i].name, value: `IP: ${data.computers[i].ip}\nMAC: ${data.computers[i].mac}\nAsigned: ${data.computers[i].bot_port?`Yes (${data.computers[i].bot_port})`:'No'}`});
        }
        await interaction.reply({ embeds: [embed] });
    },

};
