const fs = require('node:fs');
const path = require('node:path');

const { Client, Events, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

const CLIENT_ID = '573153927369981962';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

reactions = new Collection();
const reactionsPath = path.join(__dirname, 'reaction');
const reactionFiles = fs.readdirSync(reactionsPath).filter(file => file.endsWith('.js'));

for (const file of reactionFiles) {
	const filePath = path.join(reactionsPath, file);
	const reaction = require(filePath);

	if ('detectors' in reaction && 'isValid' in reaction && 'execute' in reaction) {
		reactions.set(file.replace(".js", ""), reaction);
	} else {
		console.log(`[WARNING] The reactor at ${filePath} is missing a required "detectors" or "isValid" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	//console.log(interaction);
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		console.log(`\nNew Command (${interaction.commandName})`);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	console.log(`\nNew reaction(${reaction.emoji.name})`);

	reactions.forEach(async reactor => {
		if (await reactor.isValid(reaction.emoji.name)) {
			await reactor.execute(reaction);
			return;
		}
	});
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
