const { fetchContest } = require('../../command_helpers/problem-fetcher');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

async function gimmeInteraction(difficulty) {
	const problemData = await fetchContest(difficulty);

	// Create embed based on found problem.
	const problemEmbed = {
		color: 0x1e1e22,
		title: `${problemData.chosenProblemLetter}. ${problemData.chosenProblemName}`,
		url: `https://codeforces.com/gym/${problemData.contestId}/problem/${problemData.chosenProblemLetter}`,
		description: problemData.contestName,
		fields: [
			{
				name: 'Rating',
				value: difficulty,
			},
		]
	}

	// Send it.
	await interaction.editReply({
		content: `Challenge problem for ${interaction.user.username}`,
		embeds: [problemEmbed]
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gimme')
		.setDescription('Provides a random problem from an Official ICPC contest, based on chosen difficulty.')
		.addIntegerOption(option =>
			option
				.setName('difficulty')
				.setDescription('The problem difficulty (1-10)')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(10)
		),
	async execute(interaction) {
		await interaction.deferReply();
		// Find and send a problem based on difficulty.
		const difficulty = interaction.options.getInteger('difficulty');
		gimmeInteraction(difficulty);
	},
};

module.exports = { gimmeInteraction };