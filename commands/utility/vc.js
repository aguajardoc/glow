// Suggests a random gym as a virtual contest, yet does not actually track info.
// Give priority to
// 1. Most recent gyms
// 2. Gyms where the user has no solves

const { fetchContest } = require("../../command_helpers/problem-fetcher");

function addToPage(contestId) {

}

function addPage() {

}

// Fetch the possible contest IDs.
const possibleGyms = getArrayPossibleGymContests();
const possibleNonGyms = getArrayPossibleNonGymContests();
const totalLength = possibleGyms.length() + possibleNonGyms.length();

// Reverse the arrays to get them in reverse chronological order.
possibleGyms.reverse();
possibleNonGyms.reverse();

// Declare index variables to iterate over the contests.
let indexGyms = 0;
let indexNonGyms = 0;

// A factor to "move" the indices in a proportional manner over both lists.
const conversionFactor = possibleGyms.length() / possibleNonGyms.length();

// Iterate over the lists
for (const i = 0; i < totalLength; i++) {
    let contestId;
    if (round(possibleNonGyms * conversionFactor) < i) {
        contestId = possibleNonGyms[indexNonGyms];
        indexNonGyms++;
    }
    else {
        contestId = possibleGyms[indexGyms];
        indexGyms++;
    }

    const contestURL = `https://codeforces.com/api/contest.status?contestId=${contestId}&handle=${codeforcesHandle}&count=1`
    // Check contest, to see if user has made ANY submissions to it.
        
    // If not, edit the response to include it.
        //TODO: status is OK, but result is empty when contest is good.
        try {
            const response = await fetch(contestURL);
            if (!response.ok) {
                console.log(`Failed to fetch contest data for ID: ${contestId}`);
				communicationAttempts++;
            }

            const data = await response.json();
			
            if (!data) {
                console.log('Compatible contest found!');
                // TODO: add to current page.
                addToPage(contestId);
            }
            else {
                // Don't do anything.
                console.log('Not a compatible contest.');
            }
        } 
        catch (error) {
            console.error('Error:', error);
			communicationAttempts++;
        }
    // Continue iterating and adding contests for the user to solve.

    // If count is a multiple of 5, plus one, create a new page in the bot interaction.
    if (i > 5 && i % 5 == 1) {
        // Function to make a new page and to allow user to traverse through them.
        addPage();
    }
}
// Allow the user to keep interacting with the response for the next 5 minutes, so that have time to see and choose their contest.