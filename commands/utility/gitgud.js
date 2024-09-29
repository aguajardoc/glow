// Like gimme, but with connection to database to track:
// 1. If the user has an ongoing problem to solve
// 2. What problems has the user solved, with their respective point counts
const { gimmeInteraction } = require('./gimme.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gitgud')
        .setDescription('Starts a challenge on a random problem from an Official ICPC contest, based on chosen difficulty.')
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
        // TODO: check in database if user is in an ongoing challenge.
        let ongoingChallenge = false;

        // Prompt user to finish challenge if so.
        if (ongoingChallenge === true) {
            // TODO: add prompt, based on the ongoing problem.

            // Fetch problem information from database.

            // Edit reply accordingly.
            // Message: "You have an active challenge! Give {problemName} a go at {problemURL}"
        }
        else {
            // Find a problem based on difficulty and send embed to user.
            const difficulty = interaction.options.getInteger('difficulty');
            gimmeInteraction(difficulty, interaction);

            // TODO: Save relevant data in database.
                // User data
                // Problem data
                // Current date and time
        }
        
    },
}   