// A different mode of training: allows a user to train progressively harder problems starting from a set difficulty.
// For example, a user can start at difficulty 3, solve the problem, and go up to 4,and so on until they feel like
// stopping or they fail to complete a problem within a time limit.
// Keep statistics like time taken, problems solved, and reached difficulty for self-comparison and leaderboards.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ladder')
		.setDescription('Solve progressively harder problems. Can you beat your high-score?'),
		// TODO : handle multiple arguments:
            // Action (start, continue, skip, finish training)
            // Specifier
                // Start: initial difficulty, time limit per problem
	async execute(interaction) {
		await interaction.deferReply();
		// Find and send a problem based on current difficulty.
		// const difficulty = interaction.options.getInteger('difficulty');

        // TODO: Keep most recent activity in database, then pull following difficulty from there.
        // TODO: Create ERD for database, keeping track of current difficulty, time and date, etc.

		gimmeInteraction(difficulty, interaction);
	},
};