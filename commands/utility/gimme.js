// Finds a random problem based on a given difficulty. This is a "tamer" version of gitgud: there is no compromise
// between the problem and the user, and thus the user needn't complete the given problem to request a new one.
const { fetchContest } = require('../../command_helpers/problem-fetcher');
const { errorMessage } = require('../../command_helpers/api-error');
const { SlashCommandBuilder } = require('discord.js');

async function gimmeInteraction(interaction, minimumDifficulty, maximumDifficulty=minimumDifficulty) {
	const problemData = await fetchContest(minimumDifficulty, maximumDifficulty);

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
				value: problemData.chosenProblemDifficulty,
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
		.setDescription('Provides a random problem from an Official ICPC contest, based on inputted difficulty range.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('difficulty')
				.setDescription('Returns a problem based on a single chosen difficulty.')
				.addIntegerOption(option =>
					option
						.setName('difficulty')
						.setDescription('The problem difficulty (1-10).')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(10)
				)
		)
		.addSubcommand(subcommand => 
			subcommand
				.setName('range')
				.setDescription('Returns a problem from a difficulty in the selected range.')
				.addIntegerOption(option => 
					option
						.setName('min')
						.setDescription('Minimum problem difficulty (1-10)')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(10)
				)	
				.addIntegerOption(option =>
					option
						.setName('max')
						.setDescription('Maximum problem difficulty (1-10)')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(10)
				)
		),
	async execute(interaction) {
		await interaction.deferReply();

		if (interaction.options.getSubcommand() === 'difficulty') {
			// Find and send a problem based on difficulty.
			const difficulty = interaction.options.getInteger('difficulty');
			gimmeInteraction(interaction, difficulty);
		}
		else if (interaction.options.getSubcommand() === 'range') {
			// Find and send a problem based on the difficulty range.
			const minimumDifficulty = interaction.options.getInteger('min');
			const maximumDifficulty = interaction.options.getInteger('max');
			
			// Ensure range is adequate
			if (minimumDifficulty > maximumDifficulty) {
				return interaction.editReply('The minimum difficulty cannot be greater than the maximum difficulty. Please try again.');
			}

			gimmeInteraction(interaction, minimumDifficulty, maximumDifficulty);
		}
	},
	gimmeInteraction,
};