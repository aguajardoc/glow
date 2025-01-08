// Identifies a user in the database through their Codeforces handle.
const { SlashCommandBuilder } = require("discord.js");
const { errorMessage } = require('../../command_helpers/api-error');
const { fetchContest } = require("../../command_helpers/problem-fetcher");

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function verifyCompileError(codeforcesHandle, contestId, contestProblemIndex) {
	contestURL = `https://codeforces.com/api/contest.status?contestId=${contestId}&handle=${codeforcesHandle}&from=1&count=3`;

	try {
		const response = await fetch(userURL);
		if (!response.ok) {
			return 0;
		}

		let foundCompileError = 0;
		const data = await response.json();

		for (const submission of data.result) {
			if (submission.problem.contestId = contestId &&
				submission.problem.index === contestProblemIndex &&
				submission.verdict === 'COMPILATION_ERROR') {
					foundCompileError = 1;
			}
		}

		return foundCompileError;

	}
	catch (error) {
		console.error('Error:', error);
		return -1;
	}
}

async function verifyHandle(codeforcesHandle) {
	userURL = `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`;

	try {
		const response = await fetch(userURL);
		if (!response.ok) {
			return 0;
		}
		return 1;

	}
	catch (error) {
		console.error('Error:', error);
		return -1;
	}
}

async function identify(codeforcesHandle) {
	let identificationEmbed = {
		color: 0x1e1e22
	}
	// TODO: Check if user is already identified.
	/*    
		// If so, send the following message:
	    
		identificationEmbed.description = `${interaction.user.username}, you cannot identify when your handle is already set. Ask an Admin or Moderator if you wish to change it.`;
		});
	*/
	// Else, link the Discord user to their Codeforces handle.
	// If their handle is not found in Codeforces, send the following message:
	const handleExists = await verifyHandle(codeforcesHandle);

	if (handleExists === -1) {
		errorMessage(interaction);
		return;
	}
	else if (handleExists === 0) {
		identificationEmbed.description = `Codeforces handle for ${interaction.user.username} 
											not found in database. Use ;handle identify 
											<cfhandle> (where <cfhandle> needs to be replaced 
											with your codeforces handle, e.g. ;handle identify 
											tourist) to add yourself to the database`;
	}
	else if (handleExists === 1) {

		// Else, ask for their submission of a compilation error to a difficulty 9 or 10 problem.
		// This range of difficulties ensures there are no collisions in the submissions.
		// This is the way the bot will know that the user has access to their account.
		const problemData = await fetchContest(9, 10);

		// If -1 is returned, an error with the Codeforces API has occurred; inform user.
		if (problemData === -1) {
			errorMessage(interaction);
			return;
		}

		identificationEmbed.description = `Submit a compile error to https://codeforces.com/${problemData.contestId < 100000 ? 'contest' : 'gym'}/${problemData.contestId}/problem/${problemData.chosenProblemLetter} within 60 seconds. This way, the bot will know that you have access to this account.`

		await interaction.editReply({
			embeds: [identificationEmbed]
		});

		await sleep(60000);

		const compilationErrorSubmitted = await verifyCompileError(codeforcesHandle);

	if (compilationErrorSubmitted === -1) {
		errorMessage(interaction);
		return;
	}
	else if (compilationErrorSubmitted === 0) {
		// Give the user a message to prompt them to try again 
		identificationEmbed.description = 	`Sorry ${interaction.user.username}, can you try 
											again? 	The identification process needs you to submit a compilation error to this problem!`;
	}
	else if (compilationErrorSubmitted === 1){


		// Codeforces rank colors, in ascending order of the rank they represent:
		// (Newbie, Pupil, Specialist, Expert, Candidate Master, 
		// {Master, International Master}, 
		// {Grandmaster, International Grandmaster, Legendary Grandmaster})
		const rankColors = [0x808080, 0x008000, 0x03a89e, 0x0000ff, 0xaa00aa, 0xff8c00, 0xff0000];

		let userRank; // TODO : define this

		// Create embed based on the user's information.
		identificationEmbed = {
			color: rankColors[userRank], // TODO: make this color congruent to their Codeforces rank.
			title: `${problemData.chosenProblemLetter}. ${problemData.chosenProblemName}`,
			url: `https://codeforces.com/${problemData.contestId < 100000 ? 'contest' : 'gym'}/${problemData.contestId}/problem/${problemData.chosenProblemLetter}`,
			description: `Handle for ${interaction.user.username} successfully set to (handle, with url to Codeforces)`,
		}
	}
	}
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