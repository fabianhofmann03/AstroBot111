const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summary')
		.setDescription('Fasst die letzten 10 Zeilen zusammen!')
		.addIntegerOption(option => option.setName('lines').setDescription("Choose the number of lines which should be summarized").setRequired(false)),
	async execute(interaction) {
		let channel = await interaction.client.channels.cache.get(interaction.channelId);
		let msgs = [];

		var max_int = 10;
		
		try {
			max_int = Number(`${interaction}`.split(":")[1]);
		} catch {
			max_int = 10;
		}

		if (isNaN(max_int) || max_int <= 0 || max_int == null) max_int = 10;
		console.log(max_int);

		var x = 0;

		//await channel.messages.fetch({ limit: `${max_int * 10}` }).then(messages => {
		await channel.messages.fetch({ limit: 100 }).then(messages => {
			messages.forEach(message => {
				if (!message.author.bot && x < max_int) {
					//console.log(message);
					msgs.push(message);
					x++;
				}
			})
		});

		if (msgs.size < max_int) {
			await interaction.reply("There are not enough messages.");
			return;
		}

		//console.log(msgs);
		msgs.reverse();
		var msg = "";
		msgs.forEach(message => {
			msg += message.author.username + ": " + message.content + "\n";
		});

		interaction.reply("Wait");

		var repl = await askAI(msg);
		await console.log(String(repl));
		await interaction.editReply({ content: String(repl), ephemeral: false });
	},
};

async function askAI(conversation) {
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: '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',
	});

	console.log(conversation + "\nSummarize this conversation: ");

	const openai = new OpenAIApi(configuration);
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: conversation + "\nSum up the entire conversation without loosing information. Write in the language of the conversation: ",
		max_tokens: 1000,
	});
	return String(completion.data.choices[0].text);
}