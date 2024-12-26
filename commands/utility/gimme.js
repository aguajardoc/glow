// Finds a random problem based on a given difficulty. This is a "tamer" version of gitgud: there is no compromise
// between the problem and the user, and thus the user needn't complete the given problem to request a new one.
const { fetchContest } = require('../../command_helpers/problem-fetcher');
const { errorMessage } = require('../../command_helpers/api-error');
const { SlashCommandBuilder } = require('discord.js');

async function gimmeInteraction(difficulty, interaction) {
	const problemData = await fetchContest(difficulty);

	// If -1 is returned, an error with the Codeforces API has occurred; inform user.
	if (problemData === -1) {
		errorMessage(interaction);
		return;
	}
	
	// Create embed based on found problem.
	const problemEmbed = {
		color: 0x1e1e22,
		title: `${problemData.chosenProblemLetter}. ${problemData.chosenProblemName}`,
		url: `https://codeforces.com/${problemData.contestId < 100000 ?'contest' : 'gym'}/${problemData.contestId}/problem/${problemData.chosenProblemLetter}`,
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
		gimmeInteraction(difficulty, interaction);
	},
	gimmeInteraction,
};