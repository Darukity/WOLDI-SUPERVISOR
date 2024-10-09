const { SlashCommandBuilder } = require('discord.js');

const { io } = require('socket.io-client');

// const socket = io('http://localhost:3003');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('changestatus')
		.setDescription('change the status of the bot')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The status you want to set')
                .setRequired(true)
            ),

	async execute(interaction, client) {
		const socket = io('http://localhost:3003');
		socket.emit('newStatus', "I'm a new status!", "Playing");
		await interaction.reply(interaction.options.getString('status'));
	},
};
