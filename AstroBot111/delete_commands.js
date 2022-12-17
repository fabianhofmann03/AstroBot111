const { clientId, guildId, token } = require('./config.json');

const Discord = require('discord.js');

// Replace TOKEN with your bot's token
const client = new Discord.Client({ token: `$token` });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Unregister all commands
    client.commands.forEach((value, key) => {
        client.commands.delete(key);
    });
});

client.login();