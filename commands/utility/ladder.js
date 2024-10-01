// A different mode of training: allows a user to train progressively harder problems starting from a set difficulty.
// For example, a user can start at difficulty 3, solve it, and go up to 4,and so on.
// Keep statistics like time taken, problems solved, and reached difficulty for self-comparison and leaderboards.
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ladder')
		.setDescription('Solve progressively harder problems.'),
		// TODO : handle multiple arguments:
            // Action (start, continue, skip, finish training)
            // Specifier
                // Start: initial difficulty
	async execute(interaction) {
		await interaction.deferReply();
		// Find and send a problem based on current difficulty.
		// const difficulty = interaction.options.getInteger('difficulty');

        // TODO: Keep most recent activity in database, then pull following difficulty from there.
        // TODO: Create ERD for database

		gimmeInteraction(difficulty, interaction);
	},
};