async function errorMessage(interaction) {
    // Build an embed to inform user about an error with Codeforces's API.
    const errorEmbed = {
        color: 0xffbf00,
        description: 'Codeforces API error.'
    }
    
    // Send this embed.
    await interaction.editReply({
        embeds: [errorEmbed]
    })   
}

module.exports = { errorMessage };