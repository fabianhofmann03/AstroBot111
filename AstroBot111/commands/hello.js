const { SlashCommandBuilder } = require('discord.js');
const { openai_token } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Sag Hallo wie nie zu vor!')
		.addStringOption(option => option.setName('person').setDescription("Choose the person you want to get greeted by").setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		var x = await askAI(interaction.options.getString('person'));
		console.log(x);
		await interaction.editReply({ content: String(x), ephemeral: false } );
	},
};

async function askAI(person) {
	const { Configuration, OpenAIApi } = require("openai");
	const configuration = new Configuration({
		apiKey: openai_token,
	});
	const openai = new OpenAIApi(configuration);
	console.log(`Chosen person: ` + `${person}`);
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: `Say hello like ` + `${person}` + ` would do:`,
		max_tokens: 200,

	});
	return String(completion.data.choices[0].text).trim();
}
