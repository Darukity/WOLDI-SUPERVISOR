const wol = require('wol');

const { SlashCommandBuilder } = require('discord.js');

const computers_manager = require('./computer_data/computers_manager');

// TODO: add confirm button to wake up computer

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wake')
        .setDescription('Wake a computer')
        .addStringOption(option =>
            option.setName('pc_name')
                .setDescription('The name of the computer you want to wake')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = computers_manager.getComputerNames();
        
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction, client) {
        const name = interaction.options.getString('pc_name');
        const mac = computers_manager.getMacByName(name);
        const ip = computers_manager.getIpByName(name);

        wol.wake(mac, {
            address: ip,
            port: 9
        }, function(err, res) {
            if (err) {
                console.log(err);
                interaction.reply('An error occured while trying to wake the computer');
            } else {
                interaction.reply('Computer woke up');
            }
        });
    },
};