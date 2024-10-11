const wol = require('wol');

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const computers_manager = require('./computer_data/computers_manager');

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

        const confirm = new ButtonBuilder()
        .setCustomId('wake up now')
        .setLabel('wake up now')
        .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: `Are you sure you want to wake ${name} ?`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'wake up now') {
                const mac = computers_manager.getMacByName(name);
                const ip = computers_manager.getIpByName(name);
                wol.wake(mac, {
                    address: ip,
                    port: 9
                }, function(err, res) {
                    if (err) {
                        console.log(err);
                        interaction.editReply('An error occured while trying to wake the computer');
                        return;
                    }
                });
                await confirmation.update({ content: `${name} has been waken up`, components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'Wake aborted', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
        }
    },
};