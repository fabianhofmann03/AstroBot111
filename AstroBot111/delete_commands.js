const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

comms = client.commands;

comms.foreach( com => {
    com.delete();
});