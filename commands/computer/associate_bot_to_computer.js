const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const { getPort, newPort } = require('./computer_data/port_manager');

const exec = require('child_process').exec;

const ping = require('ping');

const computers_manager = require('./computer_data/computers_manager');

// token, bots client id, id of your server, name of the computer

module.exports = {
	data: new SlashCommandBuilder()
		.setName('associatebottocomputer')
		.setDescription('Associate a bot to a computer')
        .addStringOption(option =>
            option.setName('token')
                .setDescription('The token of the bot')
                .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('bot_id')
                    .setDescription('The id of the bot')
                    .setRequired(true)
                )
            .addStringOption(option =>
                option.setName('server_id')
                    .setDescription('The id of the server')
                    .setRequired(true)
                )
            .addStringOption(option =>
                option.setName('pc_name')
                    .setDescription('The name of the computer')
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
	async execute(interaction, client, log_channel_id) {
        const ports = computers_manager.getPortList();
        
        // choose a port
        let port = getPort();
        while (true) {
            if (ports.includes(port)) {
                port = newPort();
            } else {
                break;
            }
        }

        // build and run the bot container
        exec(`docker build -t bot .`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
        }).on('exit', (code) => {
            exec(`docker run -d -p ${port}:3000 -e TOKEN=${interaction.options.getString('token')} -e CLIENT_ID=${interaction.options.getString('bot_id')} -e GUILD_ID=${interaction.options.getString('server_id')} -e LOG_CHANNEL_ID=${log_channel_id} --name ${interaction.options.getString('pc_name')} bot`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                // console.log(`stdout: ${stdout}`);
                // console.error(`stderr: ${stderr}`);
            })
        });
        //add port to computer
        const name = interaction.options.getString('pc_name');
        const update = computers_manager.updatePort(name, port);
        if (update == null) {
            await interaction.reply('This computer does not exist');
            return;
        }

        await interaction.reply('Bot associated to computer');
	},
};