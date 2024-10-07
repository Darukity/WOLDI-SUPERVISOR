const wol = require('wol');

const { SlashCommandBuilder } = require('discord.js');


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
        const mac = interaction.options.getString('mac');
        wol.wake(mac, function(err, res) {
            if (err) {
                console.log(err);
                interaction.reply('An error occured while trying to wake the computer');
            } else {
                console.log(res);
                interaction.reply('The computer has been woken up');
            }
        });
    },
};