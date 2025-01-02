// Identifies a user in the database through their Codeforces handle.
const { SlashCommandBuilder } = require("discord.js");

// A user is identified by running this command and following its instructions.
// The instructions involve the submission of a compilation error on a random Codeforces problem within one minute.
// If they fail to do so, they are not identified, but if they do, they will be added to the database.
// This unlocks every other feature, except for gimme, as it does not require this information.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('identify')
        .setDescription('Links a user to their Codeforces Handle'),
    async execute(interaction) {
        await interaction.reply('Submit a compilation error to...')
    },

}