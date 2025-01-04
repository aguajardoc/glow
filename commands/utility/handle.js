// Identifies a user in the database through their Codeforces handle.
const { SlashCommandBuilder } = require("discord.js");
const { errorMessage } = require('../../command_helpers/api-error');
const { fetchContest } = require("../../command_helpers/problem-fetcher");

async function identify(codeforcesHandle) {
    let identificationEmbed = {
		color: 0x1e1e22
	}
    // TODO: Check if user is already identified.
    /*    
		// If so, send the following message:
        
        identificationEmbed.description = `${interaction.user.username}, you cannot identify when your handle is already set. Ask an Admin or Moderator if you wish to change it.`;
	    });

		// Else, link the Discord user to their Codeforces handle.
			// If their handle is not found in Codeforces, send the following message:
			identificationEmbed.description = `Codeforces handle for ${interaction.user.username} not found in database. Use ;handle identify <cfhandle> (where <cfhandle> needs to be replaced with your codeforces handle, e.g. ;handle identify tourist) to add yourself to the database`;
	    	});

			// Else, ask for their submission of a compilation error to a difficulty 9 or 10 problem.
			// This range of difficulties ensures there are no collisions in the submissions.
			// This is the way the bot will know that the user has access to their account.
    */

	// Codeforces rank colors, in ascending order of the rank they represent:
	// (Newbie, Pupil, Specialist, Expert, Candidate Master, 
	// {Master, International Master}, 
	// {Grandmaster, International Grandmaster, Legendary Grandmaster})
	const rankColors = [0x808080, 0x008000, 0x03a89e, 0x0000ff, 0xaa00aa, 0xff8c00, 0xff0000];
	
	// Create embed based on the user's information.
	identificationEmbed = {
		color: 0x379c6f, // TODO: make this color congruent to their Codeforces rank.
		title: `${problemData.chosenProblemLetter}. ${problemData.chosenProblemName}`,
		url: `https://codeforces.com/${problemData.contestId < 100000 ?'contest' : 'gym'}/${problemData.contestId}/problem/${problemData.chosenProblemLetter}`,
		description: `Handle for ${interaction.user.username} successfully set to (handle, with url to Codeforces)`,
	}

	// Send it.
	await interaction.editReply({
		content: `Challenge problem for ${interaction.user.username}`,
		embeds: [problemEmbed]
	});
}

// A user is identified by running this command with their Codeforces handle as a parameter.
// This unlocks every other feature, except for gimme, as it does not require this information.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('handle')
        .setDescription('Performs actions based on a user\'s handle')
		.addSubcommand(subcommand =>
			subcommand
				.setName('identify')
				.setDescription('Identifies a user in the bot, granting access to all its features.')
				.addStringOption(option =>
					option
						.setName('codeforces-handle')
						.setDescription('The Codeforces handle that will be linked to your Discord user')
						.setRequired(true)
				)
		),
    async execute(interaction) {
        await interaction.deferReply();
        
		if (interaction.options.getString('codeforces-handle')) {
			identify(interaction.options.getString('codeforces-handle'));
		}
    },

}