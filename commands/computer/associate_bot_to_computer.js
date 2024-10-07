const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');

const { getPort, newPort } = require('./computer_data/port_manager');

const exec = require('child_process').exec;

// token, bots client id, id of your server
const path = 'commands/computer/computer_data/computers.json';

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
        const ports = [];

        const data = JSON.parse(fs.readFileSync(path));
        for (let i = 0; i < data.computers.length; i++) {
            if(!data.computers[i].bot_port === "") {
                ports.push(data.computers[i].bot_port);
            }
        }

        let port = getPort();
        while (true) {
            if (ports.includes(port)) {
                port = newPort();
            } else {
                break;
            }
        }
        exec(`docker build -t bot .`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
        }).on('exit', (code) => {
            exec(`docker run -d -p ${port}:3000 -e TOKEN=${interaction.options.getString('token')} -e CLIENT_ID=${interaction.options.getString('bot_id')} -e GUILD_ID=${interaction.options.getString('server_id')} --name ${interaction.options.getString('pc_name')} bot`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                // console.log(`stdout: ${stdout}`);
                // console.error(`stderr: ${stderr}`);
            });
        });
        //add port to computer
        for (let i = 0; i < data.computers.length; i++) {
            if (data.computers[i].name === interaction.options.getString('pc_name')) {
                data.computers[i].bot_port = port;
                fs.writeFileSync(path, JSON.stringify(data, null, 2));
            }
        }

        await interaction.reply('Bot associated to computer');
	},
};