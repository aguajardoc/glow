async function errorMessage(interaction) {
    // Build an embed to inform user about an error with Codeforces's API.
    const errorEmbed = {
        color: 0xffbf00,
        title: 'Codeforces API error',
        description: 'This is neither your fault nor ours. Please wait some time, then try again.'
    }
    
    // Send this embed.
    await interaction.editReply({
        embeds: [errorEmbed]
    })   
}

module.exports = { errorMessage };